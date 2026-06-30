import axios from 'axios';

// Replace with your production or local API Base URL
const API_BASE_URL = 'https://api.inuksocial.com/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach authentication token
api.interceptors.request.use(
  async (config) => {
    // Real implementation will query AsyncStorage or SecureStore
    // e.g. const token = await SecureStore.getItemAsync('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle global errors (e.g., token expiration)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Request made and server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 401) {
        // e.g. Handle user logout or token refresh
        console.warn('Unauthorized request. Logging out user...');
      }
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network Error - no response:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request Setup Error:', error.message);
    }
    return Promise.reject(error);
  }
);
