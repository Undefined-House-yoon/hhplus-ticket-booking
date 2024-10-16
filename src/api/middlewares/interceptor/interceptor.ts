import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

export class ApiResponse<T = any> {
  constructor(
    public success: boolean,
    public statusCode: number,
    public message: string | null,
    public data: T | null
  ) {}

  static success<T>(data: T, message: string = "Success"): ApiResponse<T> {
    return new ApiResponse<T>(true, 200, message, data);
  }

  static error(statusCode: number, message: string): ApiResponse<null> {
    return new ApiResponse<null>(false, statusCode, message, null);
  }
}

@Injectable()
export class CombinedApiLoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CombinedApiLoggerInterceptor.name);
  private readonly RESPONSE_TIME_THRESHOLD = 1000; // ms

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, body, headers } = req;
    const now = Date.now();

    // Request logging
    this.logRequest(method, url, headers, body);

    return next.handle().pipe(
      tap((data) => {
        const responseTime = Date.now() - now;
        const logMessage = `${method} ${url} ${responseTime}ms`;

        // Response logging
        this.logResponse(responseTime, logMessage, data);
      }),
      map(data => {
        const response = context.switchToHttp().getResponse();
        response.status(200);

        return new ApiResponse(true, 200, null, data);
      })
    );
  }

  private logRequest(method: string, url: string, headers: any, body: any) {
    this.logger.log(`Request - ${method} ${url}`);
    this.logger.debug(`Request Headers: ${JSON.stringify(headers)}`);
    this.logger.debug(`Request Body: ${JSON.stringify(body)}`);
  }

  private logResponse(responseTime: number, logMessage: string, data: any) {
    if (responseTime > this.RESPONSE_TIME_THRESHOLD) {
      this.logger.warn(`Slow response: ${logMessage}`);
    } else {
      this.logger.log(logMessage);
    }
    this.logger.debug(`Response Body: ${JSON.stringify(data)}`);
  }
}
