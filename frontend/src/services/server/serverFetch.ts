import { cookies } from 'next/headers';
import {
  buildUrl,
  buildUrlWithParams,
  extractResponseData,
  handleResponseError,
  handleNetworkError,
} from '../../utils';

interface ServerFetchOptions {
  params?: Record<string, any>;
  headers?: Record<string, string>;
  cache?: RequestCache;
  next?: {
    revalidate?: number;
    tags?: string[];
  };
}

/**
 * Server-side fetch utility for GET requests only
 * Simplified version focused on Next.js server-side data fetching
 */
export const serverFetch = async <T = any>(
  endpoint: string,
  options: ServerFetchOptions = {}
): Promise<T> => {
  const { params, headers = {}, cache, next } = options;

  // Build URL with parameters
  const url = buildUrlWithParams(buildUrl(endpoint, true), params);

  // Get cookies from request
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c: any) => `${c.name}=${c.value}`)
    .join('; ');

  // Prepare fetch options
  const fetchOptions: RequestInit = {
    method: 'GET',
    headers: {
      Cookie: cookieHeader,
      ...headers,
    },
    cache,
    next,
  };

  try {
    const response = await fetch(url, fetchOptions);

    // Handle non-success status codes
    if (!response.ok) {
      let errorData: any;
      try {
        errorData = await response.json();
      } catch {
        errorData = null;
      }
      throw handleResponseError(response.status, errorData, response.statusText);
    }

    // Parse and return response data
    const data = await response.json();
    return extractResponseData<T>(data);
  } catch (error) {
    throw handleNetworkError(error);
  }
};
