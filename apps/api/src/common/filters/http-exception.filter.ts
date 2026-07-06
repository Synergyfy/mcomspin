import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('HttpException');

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(`Internal server error: ${exception.message}`, exception.stack);
    }

    const code = exceptionResponse.code || exceptionResponse.error?.code || this.getErrorCode(status);
    const message = exceptionResponse.message || exceptionResponse.error?.message || exception.message;
    const details = exceptionResponse.details || exceptionResponse.error?.details || undefined;

    const errorBody = {
      success: false,
      error: { code, message, details },
    };

    response.status(status).json(errorBody);
  }

  private getErrorCode(status: number): string {
    const map: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'UNPROCESSABLE_ENTITY',
      429: 'TOO_MANY_REQUESTS',
      500: 'INTERNAL_ERROR',
    };
    return map[status] || 'UNKNOWN_ERROR';
  }
}
