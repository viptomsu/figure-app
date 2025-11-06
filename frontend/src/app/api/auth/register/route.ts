import { NextResponse } from 'next/server';
import type { User, ApiResponse, RegisterRequest } from '@/services/types';
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

export async function POST(request: Request): Promise<NextResponse<ApiResponse<{ user: User }>>> {
  try {
    const { username, password, email, fullName, phoneNumber, address } =
      (await request.json()) as RegisterRequest;

    const validation = validateRequiredFields(
      { username, password, email, fullName, phoneNumber },
      ['username', 'password', 'email', 'fullName', 'phoneNumber']
    );

    if (!validation.valid) {
      return createErrorResponse(
        'All required fields must be provided',
        400,
        { user: null as any },
        request
      );
    }

    const { response: backendResponse, data: parsedBody } = await proxyToBackend(
      BACKEND_ENDPOINTS.REGISTER,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          email,
          fullName,
          phoneNumber,
          address,
        }),
      }
    );

    const response = createApiResponse<{ user: User }>(
      parsedBody,
      { status: backendResponse.status },
      request
    );
    forwardBackendCookies(backendResponse, response);

    return response;
  } catch (error) {
    console.error('Registration proxy error:', error);
    return createErrorResponse(
      'Failed to connect to authentication server',
      500,
      { user: null as any },
      request
    );
  }
}
