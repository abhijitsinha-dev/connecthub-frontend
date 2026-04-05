import axios from 'axios';

// Initialize the instance
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 50000, // 10 seconds timeout
  // CRITICAL: This tells Axios to send cookies along with requests
  withCredentials: true,
});

// Response Interceptor: Global error handling
axiosClient.interceptors.response.use(
  response => {
    // Return just the data to keep components clean
    return response.data;
  },
  error => {
    // Handle global errors (e.g., 401 Unauthorized)
    if (error.response) {
      if (error.response.status === 401) {
        // Trigger logout or redirect logic.
        // The cookie might be expired or invalid.
        console.error('Unauthorized! Redirecting to login...');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
