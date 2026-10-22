import axios from 'axios';
import { AKHIL_API_BASE_URL, AKHIL_API_USERNAME, AKHIL_API_PASSWORD } from '../../secrets';
import { createApiInstance } from './apiFactory';

// Token cache - stored in memory for session duration
let tokenCache = {
  access_token: null,
  expires_at: null,
};

/**
 * Fetches authentication token from the Akhil API
 * @returns {Promise<string>} Access token
 */
const fetchAuthToken = async () => {
  try {
    const response = await axios.post(
      `${AKHIL_API_BASE_URL}/api/Token/GetToken`,
      {
        username: AKHIL_API_USERNAME,
        passwoerd: AKHIL_API_PASSWORD, // Note: Typo in API (passwoerd instead of password)
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );

    const { access_token, expires_in } = response.data;

    // Calculate expiration timestamp (current time + expires_in seconds - 5 min buffer)
    const expiresAt = Date.now() + (expires_in - 300) * 1000;

    // Cache the token
    tokenCache = {
      access_token,
      expires_at: expiresAt,
    };

    console.log('Akhil API token fetched successfully');
    return access_token;
  } catch (error) {
    console.error('Failed to fetch auth token:', error.message);
    throw new Error('Authentication failed for Akhil API');
  }
};

/**
 * Gets valid auth token (from cache or fetches new one)
 * @returns {Promise<string>} Valid access token
 */
const getValidToken = async () => {
  const now = Date.now();

  // Check if cached token exists and is still valid
  if (tokenCache.access_token && tokenCache.expires_at > now) {
    return tokenCache.access_token;
  }

  // Fetch new token if cache is empty or expired
  return await fetchAuthToken();
};

/**
 * Clears cached token (useful for forced re-authentication)
 */
export const clearTokenCache = () => {
  tokenCache = {
    access_token: null,
    expires_at: null,
  };
};

// Create axios instance for Akhil API
const akhilApiInstance = createApiInstance(AKHIL_API_BASE_URL, {
  timeout: 20000, // Longer timeout for Akhil API
});

// Request interceptor to add Bearer token
akhilApiInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await getValidToken();
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 errors
akhilApiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 error and not already retried, clear cache and retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Clear token cache and fetch new token
      clearTokenCache();

      try {
        const newToken = await getValidToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return akhilApiInstance(originalRequest);
      } catch (retryError) {
        return Promise.reject(retryError);
      }
    }

    return Promise.reject(error);
  }
);

export const akhilApi = akhilApiInstance;
