import { NextResponse } from 'next/server';
import type { ApiResponse } from '@/services/types';
import {
  CORS_ALLOWED_ORIGINS,
  CORS_HEADERS,
  CORS_METHODS,
  BACKEND_URL,
  COOKIE_NAMES,
  COOKIE_OPTIONS,
  STATUS,
} from './constants';

// CORS Utilities
export function setCorsHeaders(
  response: NextResponse,
  methods: string = 'GET, POST, OPTIONS',
  request?: Request
): NextResponse {
  // Get request origin
  const requestOrigin = request?.headers.get('origin') || request?.headers.get('Origin');

  // Only allow if origin is in the allowlist
  const allowedOrigin =
    requestOrigin && CORS_ALLOWED_ORIGINS.includes(requestOrigin)
      ? requestOrigin
      : CORS_ALLOWED_ORIGINS[0]; // Fallback to first allowed origin

  response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Methods', methods);
  response.headers.set(
    'Access-Control-Allow-Headers',
    CORS_HEADERS['Access-Control-Allow-Headers']
  );
  response.headers.set('Vary', 'Origin');

  return response;
}

export function createOptionsResponse(methods: string, request?: Request): NextResponse {
  const response = new NextResponse(null, { status: STATUS.NO_CONTENT });
  return setCorsHeaders(response, methods, request);
}

// Response Creation Utilities
export function createApiResponse<T>(
  data: any,
  options?: { status?: number },
  request?: Request
): NextResponse<ApiResponse<T>> {
  const status = options?.status || 500;

  // Type guard to check if data is a proper ApiResponse-like object
  const isApiResponseShape = (
    obj: any
  ): obj is { status: number; message: string; payload: any } => {
    return (
      obj &&
      typeof obj === 'object' &&
      !Array.isArray(obj) &&
      'status' in obj &&
      'message' in obj &&
      'payload' in obj
    );
  };

  let responseData: { status: number; message: string; payload: T | null };

  if (isApiResponseShape(data)) {
    // Data conforms to ApiResponse shape - ensure safe defaults
    responseData = {
      status: data.status || status,
      message: data.message || 'Unexpected response format',
      payload: data.payload === undefined ? null : data.payload,
    };
  } else {
    // Data is not a conforming object - use defaults
    responseData = {
      status,
      message: 'Unexpected response format',
      payload: null,
    };
  }

  const response = NextResponse.json(responseData, { status: responseData.status });
  return setCorsHeaders(response, undefined, request) as NextResponse<ApiResponse<T>>;
}

export function createSuccessResponse<T>(
  payload: T,
  message: string,
  status: number = 200,
  request?: Request
): NextResponse<ApiResponse<T>> {
  return createApiResponse(
    {
      status,
      message,
      payload,
    },
    { status },
    request
  );
}

export function createErrorResponse<T = null>(
  message: string,
  status: number = 500,
  payload: T = null as T,
  request?: Request
): NextResponse<ApiResponse<T>> {
  return createApiResponse(
    {
      status,
      message,
      payload,
    },
    { status },
    request
  );
}

// Cookie Utilities
// Store cookie domains for later use in cookie clearing
let cookieDomains: Record<string, string> = {};

export function forwardBackendCookies(
  backendResponse: Response,
  frontendResponse: NextResponse
): void {
  const setCookies =
    backendResponse.headers.getSetCookie?.() ||
    (backendResponse.headers as any).raw?.()['set-cookie'] ||
    [];

  setCookies.forEach((cookieString) => {
    // Parse cookie attributes
    const attributes = cookieString.split(';');
    const nameValue = attributes[0].split('=');
    const name = nameValue[0]?.trim();

    // Extract domain if present
    const domainAttr = attributes.find((attr) => attr.trim().toLowerCase().startsWith('domain='));
    const domain = domainAttr?.split('=')[1]?.trim();

    if (name === COOKIE_NAMES.AUTH_TOKEN) {
      cookieDomains[COOKIE_NAMES.AUTH_TOKEN] = domain || '';
    }

    frontendResponse.headers.append('Set-Cookie', cookieString);
  });
}

export function clearAuthCookie(response: NextResponse): void {
  const cookieOptions: any = {
    name: COOKIE_NAMES.AUTH_TOKEN,
    value: '',
    maxAge: 0,
    path: COOKIE_OPTIONS.path,
    httpOnly: COOKIE_OPTIONS.httpOnly,
    secure: COOKIE_OPTIONS.secure,
    sameSite: COOKIE_OPTIONS.sameSite,
  };

  // Add domain if it was used when setting the cookie
  const domain = cookieDomains[COOKIE_NAMES.AUTH_TOKEN];
  if (domain) {
    cookieOptions.domain = domain;
  }

  response.cookies.set(cookieOptions);
}

// Backend Proxy Utilities
export async function parseBackendResponse(backendResponse: Response): Promise<any> {
  // Handle 204 No Content or empty body
  if (backendResponse.status === STATUS.NO_CONTENT || backendResponse.status === 204) {
    return {
      status: backendResponse.status,
      message: 'Request successful',
      payload: null,
    };
  }

  const responseBody = await backendResponse.text();

  // Handle empty body
  if (!responseBody || responseBody.trim() === '') {
    return {
      status: backendResponse.status,
      message: 'Request successful',
      payload: null,
    };
  }

  const contentType = backendResponse.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    try {
      return JSON.parse(responseBody);
    } catch {
      return {
        status: backendResponse.status,
        message: 'Invalid JSON response',
        payload: null,
      };
    }
  }

  // Non-JSON response - normalize to ApiResponse format
  return {
    status: backendResponse.status,
    message: 'Request successful',
    payload: null,
  };
}

export async function proxyToBackend(
  endpoint: string,
  options: RequestInit
): Promise<{ response: Response; data: any }> {
  const url = `${BACKEND_URL}${endpoint}`;

  // Ensure credentials are included
  const fetchOptions = {
    ...options,
    credentials: 'include' as const,
  };

  const backendResponse = await fetch(url, fetchOptions);
  const parsedData = await parseBackendResponse(backendResponse);

  return {
    response: backendResponse,
    data: parsedData,
  };
}

// Validation Utilities
export function validateRequiredFields(
  data: Record<string, any>,
  requiredFields: string[]
): { valid: boolean; missing: string[] } {
  const missing: string[] = [];

  for (const field of requiredFields) {
    if (!data[field]) {
      missing.push(field);
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}
