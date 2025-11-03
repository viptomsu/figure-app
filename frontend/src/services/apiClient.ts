import axios, {
	AxiosInstance,
	InternalAxiosRequestConfig,
	AxiosResponse,
	AxiosError,
} from "axios";
import queryString from "query-string";
import { API_CONFIG, getStoredToken } from "./config";
import { ApiError } from "./types";

const apiClient: AxiosInstance = axios.create({
	baseURL: API_CONFIG.BASE_URL,
	timeout: API_CONFIG.TIMEOUT,
	headers: API_CONFIG.DEFAULT_HEADERS,
	paramsSerializer: {
		serialize: (params: Record<string, any>) => {
			return queryString.stringify(params, {
				skipNull: true,
				skipEmptyString: true,
				arrayFormat: "bracket",
			});
		},
	},
});

apiClient.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		const token = getStoredToken();
		if (token && !config.headers?.skipAuth) {
			config.headers = {
				...config.headers,
				Authorization: `Bearer ${token}`,
			} as any;
		}

		if (config.headers?.skipAuth) {
			delete config.headers.skipAuth;
		}

		return config;
	},
	(error: AxiosError) => {
		console.error("Request interceptor error:", error);
		return Promise.reject(error);
	}
);

apiClient.interceptors.response.use(
	(response: AxiosResponse) => {
		return response.data;
	},
	(error: AxiosError) => {
		if (process.env.NODE_ENV === "development") {
			console.error(
				`❌ API Error: ${error.config?.method?.toUpperCase()} ${
					error.config?.url
				}`,
				{
					status: error.response?.status,
					data: error.response?.data,
					message: error.message,
				}
			);
		}

		let apiError: ApiError;

		if (error.response) {
			const { status, data } = error.response;
			const httpStatus = error.status || status;
			const responseData = data as { message?: string; code?: string; details?: any };
			const message = responseData?.message || error.message || "API Error";

			apiError = new ApiError(message, httpStatus, responseData?.code, responseData?.details);

			switch (httpStatus) {
				case 401:
					localStorage.removeItem(API_CONFIG.TOKEN_KEY);
					localStorage.removeItem(API_CONFIG.USER_KEY);
					apiError = ApiError.unauthorized(responseData?.message || "Unauthorized");
					break;
				case 403:
					apiError = ApiError.forbidden(responseData?.message || "Forbidden");
					break;
				case 404:
					apiError = ApiError.notFound(responseData?.message || "Not Found");
					break;
				case 500:
					apiError = ApiError.serverError(
						responseData?.message || "Internal Server Error"
					);
					break;
				default:
					apiError = ApiError.badRequest(message, responseData?.details);
					break;
			}
		} else if (error.request) {
			// Network error (request was made but no response received)
			apiError = ApiError.networkError("Network Error - No response received");
		} else {
			// Other error (request setup error)
			apiError = new ApiError(error.message || "Request Error");
		}

		return Promise.reject(apiError);
	}
);

export default apiClient;
