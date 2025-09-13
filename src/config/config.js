// Configuration file for the application
const config = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:9011',

  // Authentication Configuration
  JWT_STORAGE_KEY: 'jwt',
  USER_STORAGE_KEY: 'user',

  // Application Configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || 'My App',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
};

export default config;
