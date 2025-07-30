// Environment configuration helper
// This file centralizes all environment variable access

export const ENV = {
  // API Configuration
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 
    (import.meta.env.MODE === 'production' 
      ? 'https://yourdomain.com/api' 
      : 'http://localhost:8000/api'),
  
  FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL || 
    (import.meta.env.MODE === 'production' 
      ? 'https://yourdomain.com' 
      : 'http://localhost:5173'),

  // App Configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Vibranta Club',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // Environment Info
  NODE_ENV: import.meta.env.VITE_NODE_ENV || import.meta.env.MODE,
  IS_PRODUCTION: import.meta.env.MODE === 'production',
  IS_DEVELOPMENT: import.meta.env.MODE === 'development',
  
  // Cashfree Configuration
  CASHFREE_MODE: import.meta.env.VITE_CASHFREE_MODE || 
    (import.meta.env.MODE === 'production' ? 'production' : 'sandbox'),
  
  // Debug Mode
  DEBUG: import.meta.env.VITE_DEBUG === 'true',
  
  // Analytics (for future use)
  GA_TRACKING_ID: import.meta.env.VITE_GA_TRACKING_ID,
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
};

// Debug logging (only in development)
if (ENV.DEBUG && ENV.IS_DEVELOPMENT) {
  // Commented for production deployment
  // console.group('🔧 Environment Configuration');
  // console.log('Backend URL:', ENV.BACKEND_URL);
  // console.log('Frontend URL:', ENV.FRONTEND_URL);
  // console.log('Environment:', ENV.NODE_ENV);
  // console.log('Cashfree Mode:', ENV.CASHFREE_MODE);
  // console.log('Debug Mode:', ENV.DEBUG);
  // console.groupEnd();
}

// Environment validation
export const validateEnvironment = () => {
  const errors = [];
  
  if (ENV.IS_PRODUCTION) {
    if (ENV.BACKEND_URL.includes('localhost')) {
      errors.push('Production build should not use localhost for backend URL');
    }
    if (ENV.FRONTEND_URL.includes('localhost')) {
      errors.push('Production build should not use localhost for frontend URL');
    }
    if (ENV.CASHFREE_MODE === 'sandbox') {
      console.warn('⚠️ Warning: Using Cashfree sandbox mode in production');
    }
  }
  
  if (errors.length > 0) {
    console.error('❌ Environment Configuration Errors:');
    errors.forEach(error => console.error(`- ${error}`));
    if (ENV.IS_PRODUCTION) {
      throw new Error('Invalid production environment configuration');
    }
  }
  
  return errors.length === 0;
};

export default ENV;
