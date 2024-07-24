import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

class ApiResponse {
  constructor(
    public success: boolean,
    public statusCode: number,
    public message: string,
    public data: any
  ) {}
}

@Catch()
export class CombinedExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(CombinedExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '서버 내부 에러';
    let success = false;

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      status = exception.getStatus();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        ({ message = message } = exceptionResponse as any);
      } else if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      }

      this.logger.warn(`HttpException: ${message}`, {
        statusCode: status,
        path: request.url,
        method: request.method,
      });
    } else {
      this.logger.error(
        `UnhandledException: ${message}`,
        exception instanceof Error ? exception.stack : 'No stack trace available',
        {
          statusCode: status,
          path: request.url,
          method: request.method,
        }
      );
    }

    const errorResponse = new ApiResponse(
      success,
      status,
      message,
      null
    );

    response.status(HttpStatus.OK).json(errorResponse);
  }
}
