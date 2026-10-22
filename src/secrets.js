// Legacy API (existing backend)
const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;
const SITE_URL = import.meta.env.VITE_SITE_URL;

// Akhil API (for specific branches)
const AKHIL_API_BASE_URL = import.meta.env.VITE_AKHIL_API_BASE_URL;
const AKHIL_API_USERNAME = import.meta.env.VITE_AKHIL_API_USERNAME;
const AKHIL_API_PASSWORD = import.meta.env.VITE_AKHIL_API_PASSWORD;

export {
  BASE_URL,
  API_TOKEN,
  SITE_URL,
  AKHIL_API_BASE_URL,
  AKHIL_API_USERNAME,
  AKHIL_API_PASSWORD
};