import { cookies } from 'next/headers';
import queryString from 'query-string';
import { API_CONFIG } from './config';
import { ApiError } from './types';

interface ServerFetchOptions {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	params?: Record<string, any>;
	body?: any;
	headers?: Record<string, string>;
	cache?: RequestCache;
	next?: {
		revalidate?: number;
		tags?: string[];
	};
	timeout?: number;
}

export const serverFetch = async <T = any>(
	endpoint: string,
	options: ServerFetchOptions = {}
): Promise<T> => {
	const {
		method = 'GET',
		params,
		body,
		headers = {},
		cache,
		next,
		timeout = API_CONFIG.TIMEOUT,
	} = options;

	// Build URL
	const url = new URL(API_CONFIG.BASE_URL + endpoint);

	// Serialize query parameters
	if (params) {
		url.search = queryString.stringify(params, {
			skipNull: true,
			skipEmptyString: true,
			arrayFormat: 'bracket',
		});
	}

	// Get cookies from request
	const cookieStore = cookies();
	const cookieHeader = cookieStore
		.getAll()
		.map((c) => `${c.name}=${c.value}`)
		.join('; ');

	// Prepare fetch options
	const fetchOptions: RequestInit = {
		method,
		headers: {
			'Cookie': cookieHeader,
			...headers,
		},
		cache,
		next,
	};

	// Add body for non-GET requests
	if (body && method !== 'GET') {
		if (body instanceof FormData) {
			// Remove Content-Type for FormData (browser will set it with boundary)
			delete fetchOptions.headers?.['Content-Type'];
			fetchOptions.body = body;
		} else {
			// Add Content-Type for JSON body
			fetchOptions.headers = {
				'Content-Type': 'application/json',
				...fetchOptions.headers,
			};
			fetchOptions.body = JSON.stringify(body);
		}
	}

	// Create AbortController for timeout
	const controller = new AbortController();
	const timeoutId = setTimeout(() => {
		controller.abort();
	}, timeout);

	try {
		const response = await fetch(url.toString(), {
			...fetchOptions,
			signal: controller.signal,
		});

		// Clear timeout after response received
		clearTimeout(timeoutId);

		// Handle non-success status codes
		if (!response.ok) {
			let errorMessage = 'API Error';
			let errorData: any = null;

			try {
				const errorResponse = await response.json();
				errorMessage = errorResponse.message || errorMessage;
				errorData = errorResponse;
			} catch {
				errorMessage = `HTTP ${response.status}: ${response.statusText}`;
			}

			switch (response.status) {
				case 401:
					throw ApiError.unauthorized(errorMessage);
				case 403:
					throw ApiError.forbidden(errorMessage);
				case 404:
					throw ApiError.notFound(errorMessage);
				case 500:
					throw ApiError.serverError(errorMessage);
				default:
					throw ApiError.badRequest(errorMessage, errorData?.details);
			}
		}

		// Parse response JSON
		const data = await response.json();

		// Auto-extract data from response (same as apiClient)
		return data.payload || data.data || data;
	} catch (error) {
		// Clear timeout if still pending
		clearTimeout(timeoutId);

		// If it's already an ApiError, re-throw
		if (error instanceof ApiError) {
			throw error;
		}

		// Handle abort errors (timeout)
		if (error instanceof Error && error.name === 'AbortError') {
			throw ApiError.networkError('Request timed out');
		}

		// Network error or other error
		if (error instanceof Error) {
			throw ApiError.networkError(error.message);
		}

		throw ApiError.networkError('Unknown error occurred');
	}
};
