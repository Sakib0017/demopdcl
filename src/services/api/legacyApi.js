import { BASE_URL, API_TOKEN } from '../../secrets';
import { createApiInstance } from './apiFactory';

// Create axios instance for legacy API
const legacyApiInstance = createApiInstance(BASE_URL);

// Request interceptor to add token as query parameter
legacyApiInstance.interceptors.request.use(
  (config) => {
    // Add token to query parameters
    config.params = {
      ...config.params,
      token: API_TOKEN,
    };
    return config;
  },
  (error) => Promise.reject(error)
);

export const legacyApi = legacyApiInstance;
