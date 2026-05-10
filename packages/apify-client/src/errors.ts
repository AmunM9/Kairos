export class ApifyApiError extends Error {
  statusCode?: number;
  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'ApifyApiError';
    this.statusCode = statusCode;
  }
}
