import { StatusCodes } from 'http-status-codes';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors?: any
  ) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static badRequest(message: string, errors?: any) {
    return new ApiError(StatusCodes.BAD_REQUEST, message, errors);
  }

  static internal(message: string = 'Internal Server Error') {
    return new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, message);
  }

  static notFound(message: string = 'Resource Not Found') {
    return new ApiError(StatusCodes.NOT_FOUND, message);
  }

  static conflict(message: string) {
    return new ApiError(StatusCodes.CONFLICT, message);
  }
}
