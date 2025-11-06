import { NextResponse } from 'next/server';
import type { ApiResponse } from '@/services/types';
import {
  createOptionsResponse,
  createSuccessResponse,
  clearAuthCookie,
} from '@/app/api/utils';
import { CORS_METHODS } from '@/app/api/constants';

export async function OPTIONS(request: Request): Promise<NextResponse> {
  return createOptionsResponse(CORS_METHODS.AUTH_ROUTES, request);
}

export async function POST(request: Request): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const response = createSuccessResponse(null, 'Logged out successfully', 200, request);
    clearAuthCookie(response);
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    const response = createSuccessResponse(null, 'Logged out successfully', 200, request);
    clearAuthCookie(response);
    return response;
  }
}
