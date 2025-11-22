import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import type { ApiResponse } from '@/services/types';
import { createOptionsResponse, createSuccessResponse, createErrorResponse } from '@/app/api/utils';
import { CORS_METHODS, COOKIE_NAMES } from '@/app/api/constants';

export async function OPTIONS(request: Request): Promise<NextResponse> {
  return createOptionsResponse(CORS_METHODS.READ_ROUTES, request);
}

export async function GET(
  request: Request
): Promise<NextResponse<ApiResponse<{ authenticated: boolean }>>> {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get(COOKIE_NAMES.AUTH_TOKEN);

    if (!authToken) {
      return createErrorResponse('No active session', 401, { authenticated: false }, request);
    }

    return createSuccessResponse({ authenticated: true }, 'Session is valid', 200, request);
  } catch (error) {
    console.error('Session validation error:', error);
    return createErrorResponse('No active session', 401, { authenticated: false }, request);
  }
}
