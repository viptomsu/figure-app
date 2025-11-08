class ApiResponse<T = unknown> {
  statusCode: number;
  payload: T | null;
  message: string;
  success: boolean;

  constructor(statusCode: number, payload: T | null, message: string) {
    this.statusCode = statusCode;
    this.payload = payload;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export { ApiResponse };