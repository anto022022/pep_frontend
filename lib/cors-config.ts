// CORS configuration with environment variable support
export const corsConfig = {
  // Allow specific origins in production, all in development
  allowedOrigins: process.env.NODE_ENV === 'production' 
    ? (process.env.ALLOWED_ORIGINS?.split(',') || ['https://yourdomain.com'])
    : ['*'],
  
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  
  allowedHeaders: [
    'Content-Type',
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin',
    'X-API-Key'
  ],
  
  allowCredentials: true,
  
  maxAge: 86400, // 24 hours
};

export function getCorsHeaders(origin?: string) {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': corsConfig.allowedMethods.join(', '),
    'Access-Control-Allow-Headers': corsConfig.allowedHeaders.join(', '),
    'Access-Control-Allow-Credentials': corsConfig.allowCredentials.toString(),
    'Access-Control-Max-Age': corsConfig.maxAge.toString(),
  };

  // Handle origin based on configuration
  if (corsConfig.allowedOrigins.includes('*')) {
    headers['Access-Control-Allow-Origin'] = '*';
  } else if (origin && corsConfig.allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  } else if (corsConfig.allowedOrigins.length > 0) {
    headers['Access-Control-Allow-Origin'] = corsConfig.allowedOrigins[0];
  }

  return headers;
} 