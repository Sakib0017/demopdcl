import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import axios from 'axios';

/**
 * Custom hook for making API calls with proper error handling, loading states, and cleanup
 * @param {string} url - The API endpoint URL
 * @param {Object} options - Configuration options
 * @returns {Object} API call state and methods
 */
export const useApiCall = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const cancelTokenRef = useRef(null);
  const isMountedRef = useRef(true);

  const {
    params = {},
    method = 'GET',
    autoFetch = false,
    maxRetries = 3,
    retryDelay = 1000,
    onSuccess,
    onError,
    transform = (data) => data,
  } = options;

  // Use refs to store the latest callback values to avoid dependency issues
  const transformRef = useRef(transform);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  
  // Update refs when callbacks change
  useEffect(() => {
    transformRef.current = transform;
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  });

  // Memoize params to prevent unnecessary re-renders
  const stableParams = useMemo(() => params, [JSON.stringify(params)]);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel('Component unmounted');
      }
    };
  }, []);

  // Make API call with error handling and retry logic
  const fetchData = useCallback(async (customParams = {}) => {
    // Cancel previous request if exists
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel('New request initiated');
    }

    // Create new cancel token
    cancelTokenRef.current = axios.CancelToken.source();

    const finalParams = { ...stableParams, ...customParams };

    setLoading(true);
    setError(null);

    try {
      const response = await axios({
        url,
        method,
        params: finalParams,
        cancelToken: cancelTokenRef.current.token,
        timeout: 15000, // 15 second timeout for better reliability
        // Add retry configuration
        validateStatus: (status) => status < 500, // Don't throw for 4xx errors, handle them gracefully
      });

      if (!isMountedRef.current) return;

      let transformedData = response.data;
      
      // Handle different response formats
      if (response.data?.data) {
        transformedData = response.data.data.data || response.data.data;
      }

      // Apply custom transform function
      transformedData = transformRef.current(transformedData);

      setData(transformedData);
      setRetryCount(0); // Reset retry count on success
      
      onSuccessRef.current?.(transformedData, response);
    } catch (err) {
      if (!isMountedRef.current) return;
      
      // Don't handle cancelled requests as errors
      if (axios.isCancel(err)) return;

      const errorMessage = getErrorMessage(err);
      setError(errorMessage);

      onErrorRef.current?.(err, errorMessage);

      // Auto-retry logic for network errors
      if (shouldRetry(err) && retryCount < maxRetries) {
        setTimeout(() => {
          if (isMountedRef.current) {
            setRetryCount(prev => prev + 1);
            fetchData(customParams);
          }
        }, retryDelay * (retryCount + 1)); // Exponential backoff
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [url, method, stableParams, retryCount, maxRetries, retryDelay]);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  // Manual retry function
  const retry = useCallback(() => {
    setRetryCount(0);
    fetchData();
  }, [fetchData]);

  // Clear data and error
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setRetryCount(0);
    setLoading(false);
    
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel('Reset called');
    }
  }, []);

  return {
    data,
    loading,
    error,
    retryCount,
    maxRetries,
    fetchData,
    retry,
    reset,
    isRetrying: retryCount > 0 && loading,
  };
};

/**
 * Get user-friendly error message from error object
 */
const getErrorMessage = (error) => {
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const message = error.response.data?.message || error.response.statusText;
    
    switch (status) {
      case 401:
        return 'Authentication failed. Please refresh the page.';
      case 403:
        return 'Access denied. You do not have permission to view this content.';
      case 404:
        return 'The requested data could not be found.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'Server error. Please try again later.';
      case 503:
        return 'Service temporarily unavailable. Please try again later.';
      default:
        return message || `Request failed with status ${status}`;
    }
  } else if (error.request) {
    // Network error or timeout
    if (error.code === 'ECONNABORTED' && error.message?.includes('timeout')) {
      return 'Request timed out. The server is taking too long to respond. Please check your connection and try again.';
    }
    if (error.code === 'ECONNABORTED') {
      return 'Connection aborted. Please check your internet connection and try again.';
    }
    if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
      return 'Network connection failed. Please check your internet connection and try again.';
    }
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  } else {
    // Other error
    return error.message || 'An unexpected error occurred. Please refresh the page and try again.';
  }
};

/**
 * Determine if an error should trigger a retry
 */
const shouldRetry = (error) => {
  if (error.response) {
    const status = error.response.status;
    // Retry on server errors and rate limiting, but not on client errors
    return status >= 500 || status === 429;
  }
  
  // Retry on network errors
  return error.request && !error.response;
};

/**
 * Specialized hook for fetching healthcare organization data
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {Object} options - Configuration options
 */
export const useHealthcareApi = (endpoint, options = {}) => {
  return useApiCall(endpoint, {
    ...options,
    // Add default error handling specific to healthcare data
    onError: (error, message) => {
      // Log errors for healthcare compliance if needed
      // console.info('Healthcare API Error:', { endpoint, error: message });
      
      if (options.onError) {
        options.onError(error, message);
      }
    },
    // Transform healthcare API responses
    transform: (data) => {
      if (options.transform) {
        return options.transform(data);
      }
      return data;
    },
  });
};