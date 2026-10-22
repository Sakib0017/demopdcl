import axios from 'axios';

/**
 * Creates a configured axios instance with interceptors
 * @param {string} baseURL - Base URL for the API
 * @param {object} config - Additional axios configuration
 * @returns {object} Configured axios instance
 */
export const createApiInstance = (baseURL, config = {}) => {
  const instance = axios.create({
    baseURL,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
    },
    ...config,
  });

  // Response interceptor for consistent error handling
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Enhanced error handling
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || error.response.statusText;
        console.error('API Error:', {
          url: error.config.url,
          status: error.response.status,
          message: errorMessage,
        });
      } else if (error.request) {
        // Request made but no response received
        console.error('Network Error:', {
          url: error.config.url,
          message: 'No response received from server',
        });
      } else {
        // Error in request configuration
        console.error('Request Error:', error.message);
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

/**
 * Normalizes API response to a consistent format
 * @param {boolean} success - Success status
 * @param {*} data - Response data
 * @param {object} pagination - Pagination info
 * @param {*} error - Error message
 * @param {string} apiType - API type identifier (LEGACY, AKHIL, etc.)
 * @returns {object} Normalized response
 */
export const normalizeResponse = ({
  success = true,
  data = null,
  pagination = null,
  error = null,
  errorCode = null,
  apiType = null,
}) => ({
  success,
  data,
  pagination,
  error,
  errorCode,
  apiType,
});
