export const corsConfig = {
  // Development: Allow all origins
  development: {
    origin: true, // Allow all origins
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
      'Cache-Control',
      'Pragma'
    ],
    exposedHeaders: ['Content-Length', 'Content-Range'],
    maxAge: 86400, // 24 hours
  },
  
  // Production: More restrictive (you can customize this)
  production: {
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://yourdomain.com', // Add your production domain
      'https://www.yourdomain.com'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept'
    ],
    maxAge: 86400,
  }
};

// Get CORS config based on environment
export const getCorsConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  return corsConfig[env] || corsConfig.development;
};
