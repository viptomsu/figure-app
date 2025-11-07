import queryString from 'query-string';
import { API_CONFIG } from '../services/config';

/**
 * Builds a URL with base URL and endpoint
 * @param endpoint - API endpoint path
 * @param useServerUrl - Whether to use server-side base URL
 * @returns Full URL string
 */
export const buildUrl = (endpoint: string, useServerUrl: boolean = false): string => {
  const baseUrl = useServerUrl ? process.env.API_BASE_URL : API_CONFIG.BASE_URL;
  return baseUrl + endpoint;
};

/**
 * Serializes parameters for API requests
 * @param params - Parameters object
 * @returns Serialized query string
 */
export const serializeParams = (params: Record<string, any>): string => {
  return queryString.stringify(params, {
    skipNull: true,
    skipEmptyString: true,
    arrayFormat: 'bracket',
  });
};

/**
 * Builds a URL with query parameters
 * @param baseUrl - Base URL
 * @param params - Query parameters object
 * @returns URL string with serialized query parameters
 */
export const buildUrlWithParams = (baseUrl: string, params?: Record<string, any>): string => {
  if (!params || Object.keys(params).length === 0) {
    return baseUrl;
  }

  const url = new URL(baseUrl);
  url.search = serializeParams(params);

  return url.toString();
};

/**
 * Extracts data from API response
 * Checks for common response patterns (payload, data) or returns the response directly
 * @param response - API response data
 * @returns Extracted data
 */
export const extractResponseData = <T = any>(response: any): T => {
  return response.payload || response.data || response;
};
