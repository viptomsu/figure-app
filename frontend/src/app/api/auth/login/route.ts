import { NextResponse } from 'next/server';
import type { User, ApiResponse } from '@/services/types';
import {
  createOptionsResponse,
  createApiResponse,
  createErrorResponse,
  forwardBackendCookies,
  proxyToBackend,
  validateRequiredFields,
} from '@/app/api/utils';
import { BACKEND_ENDPOINTS, CORS_METHODS } from '@/app/api/constants';

export async function OPTIONS(request: Request): Promise<NextResponse> {
  return createOptionsResponse(CORS_METHODS.AUTH_ROUTES, request);
}

export async function POST(request: Request): Promise<NextResponse<ApiResponse<User | null>>> {
  try {
    const { username, password } = await request.json();

    const validation = validateRequiredFields({ username, password }, ['username', 'password']);

    if (!validation.valid) {
      return createErrorResponse('Username and password are required', 400, null, request);
    }

    const { response: backendResponse, data: parsedBody } = await proxyToBackend(
      BACKEND_ENDPOINTS.LOGIN,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      }
    );

    const response = createApiResponse<User>(
      parsedBody,
      { status: backendResponse.status },
      request
    );
    forwardBackendCookies(backendResponse, response);

    return response;
  } catch (error) {
    console.error('Login proxy error:', error);
    return createErrorResponse('Failed to connect to authentication server', 500, null, request);
  }
}
