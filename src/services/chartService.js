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
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem(config.JWT_STORAGE_KEY);
      localStorage.removeItem(config.USER_STORAGE_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const chartService = {
  // Get entry time analysis data
  getEntryTimeAnalysis: async (dateFrom = null, dateTo = null) => {
    try {
      const params = new URLSearchParams();
      if (dateFrom) params.append('dateFrom', dateFrom);
      if (dateTo) params.append('dateTo', dateTo);

      console.log('Fetching entry time analysis with params:', { dateFrom, dateTo });
      const response = await api.get(`/api/visiteurs/charts/entry-time-analysis?${params}`);
      console.log('Entry time analysis response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching entry time analysis:', error);
      throw error;
    }
  },

  // Get visit duration analysis data
  getVisitDurationAnalysis: async (dateFrom = null, dateTo = null) => {
    try {
      const params = new URLSearchParams();
      if (dateFrom) params.append('dateFrom', dateFrom);
      if (dateTo) params.append('dateTo', dateTo);

      console.log('Fetching visit duration analysis with params:', { dateFrom, dateTo });
      const response = await api.get(`/api/visiteurs/charts/visit-duration-analysis?${params}`);
      console.log('Visit duration analysis response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching visit duration analysis:', error);
      throw error;
    }
  },

  // Get visitor type analysis data
  getVisitorTypeAnalysis: async (dateFrom = null, dateTo = null) => {
    try {
      const params = new URLSearchParams();
      if (dateFrom) params.append('dateFrom', dateFrom);
      if (dateTo) params.append('dateTo', dateTo);

      console.log('Fetching visitor type analysis with params:', { dateFrom, dateTo });
      const response = await api.get(`/api/visiteurs/charts/visitor-type-analysis?${params}`);
      console.log('Visitor type analysis response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching visitor type analysis:', error);
      throw error;
    }
  },

  // Get average visit duration analysis data
  getAverageVisitDurationAnalysis: async (dateFrom = null, dateTo = null) => {
    try {
      const params = new URLSearchParams();
      if (dateFrom) params.append('dateFrom', dateFrom);
      if (dateTo) params.append('dateTo', dateTo);

      console.log('Fetching average visit duration analysis with params:', { dateFrom, dateTo });
      const response = await api.get(`/api/visiteurs/charts/average-visit-duration?${params}`);
      console.log('Average visit duration analysis response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching average visit duration analysis:', error);
      throw error;
    }
  },

  // Get daily peak hours data
  getDailyPeakHours: async (dateFrom = null, dateTo = null) => {
    try {
      const params = new URLSearchParams();
      if (dateFrom) params.append('dateFrom', dateFrom);
      if (dateTo) params.append('dateTo', dateTo);

      console.log('Fetching daily peak hours with params:', { dateFrom, dateTo });
      const response = await api.get(`/api/visiteurs/daily-peak-hours?${params}`);
      console.log('Daily peak hours response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching daily peak hours:', error);
      throw error;
    }
  }
};
