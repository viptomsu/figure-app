import { ApiError } from '../services/types';

/**
 * Handles HTTP response errors and converts them to ApiError instances
 * @param status - HTTP status code
 * @param errorResponse - Parsed error response data
 * @param statusText - HTTP status text (optional, used as fallback error message)
 * @returns ApiError instance
 */
export const handleResponseError = (
  status: number,
  errorResponse?: any,
  statusText?: string
): ApiError => {
  let errorMessage = 'API Error';
  let errorData: any = errorResponse;

  if (errorData) {
    errorMessage = errorData.message || errorMessage;
  } else if (statusText) {
    errorMessage = `HTTP ${status}: ${statusText}`;
  }

  // Create appropriate ApiError based on status code
  switch (status) {
    case 401:
      return ApiError.unauthorized(errorMessage);
    case 403:
      return ApiError.forbidden(errorMessage);
    case 404:
      return ApiError.notFound(errorMessage);
    case 500:
      return ApiError.serverError(errorMessage);
    default:
      return ApiError.badRequest(errorMessage, errorData?.details);
  }
};

/**
 * Handles network errors and converts them to ApiError instances
 * @param error - The caught error
 * @returns ApiError instance
 */
export const handleNetworkError = (error: unknown): ApiError => {
  // If it's already an ApiError, return it
  if (error instanceof ApiError) {
    return error;
  }

  // Network error or other error
  if (error instanceof Error) {
    return ApiError.networkError(error.message);
  }

  return ApiError.networkError('Unknown error occurred');
};
