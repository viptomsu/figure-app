// CORS Configuration
export const ALLOWED_ORIGINS = {
  production: 'https://yourdomain.com',
  development: 'http://localhost:3000',
} as const;

// Parse comma-separated list of allowed origins from environment
export const CORS_ALLOWED_ORIGINS: string[] = (() => {
  const envOrigins = process.env.CORS_ALLOWED_ORIGINS;
  if (envOrigins) {
    return envOrigins.split(',').map((origin) => origin.trim());
  }
  // Fallback to default origins based on environment
  return process.env.NODE_ENV === 'production'
    ? [ALLOWED_ORIGINS.production]
    : [ALLOWED_ORIGINS.development];
})();

export const CORS_HEADERS = {
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
} as const;

export const CORS_METHODS = {
  AUTH_ROUTES: 'POST, OPTIONS',
  READ_ROUTES: 'GET, OPTIONS',
} as const;

// Cookie Configuration
export const COOKIE_NAMES = {
  AUTH_TOKEN: 'auth_token',
} as const;

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
} as const;

// Backend Configuration
export const BACKEND_URL = process.env.API_BASE_URL || 'http://localhost:8080/api';

export const BACKEND_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
} as const;

// HTTP Status Codes
export const STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  INTERNAL_ERROR: 500,
} as const;
