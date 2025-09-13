import axios from 'axios';
import config from '../config/config';

// Base URL for your Spring Boot backend
const API_BASE_URL = config.API_BASE_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token in requests
api.interceptors.request.use(
  (requestConfig) => {
    const token = localStorage.getItem(config.JWT_STORAGE_KEY);
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
    return requestConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, logout user
      localStorage.removeItem(config.JWT_STORAGE_KEY);
      localStorage.removeItem(config.USER_STORAGE_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

class AuthService {
  // Login user
  async login(username, password) {
    try {
      const response = await api.post('/auth/login', {
        username,
        password,
      });
      
      const { jwt } = response.data;
      
      if (jwt) {
        // Store JWT token in localStorage
        localStorage.setItem(config.JWT_STORAGE_KEY, jwt);

        // Decode JWT to get user info (basic decoding, not verification)
        const payload = this.decodeJWT(jwt);
        if (payload) {
          localStorage.setItem(config.USER_STORAGE_KEY, JSON.stringify({
            username: payload.sub,
            // Add other user info from JWT payload if available
          }));
        }
      }
      
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
        'Connexion échouée. Veuillez vérifier vos identifiants.'
      );
    }
  }

  // Logout user
  logout() {
    localStorage.removeItem(config.JWT_STORAGE_KEY);
    localStorage.removeItem(config.USER_STORAGE_KEY);
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem(config.JWT_STORAGE_KEY);
    if (!token) return false;

    // Check if token is expired
    try {
      const payload = this.decodeJWT(token);
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  // Get current user
  getCurrentUser() {
    const userStr = localStorage.getItem(config.USER_STORAGE_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  // Get JWT token
  getToken() {
    return localStorage.getItem(config.JWT_STORAGE_KEY);
  }

  // Basic JWT decoding (client-side only, not for verification)
  decodeJWT(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  }
}

export default new AuthService();
