import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class RequestInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RequestInterceptor.name);

  private sanitize(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map((item) => this.sanitize(item));

    const sensitiveFields = [
      'password',
      'newpassword',
      'oldpassword',
      'confirmpassword',
      'confirmnewpassword',
      'authorization',
      'cookie',
      'token',
      'secret',
    ];

    const sanitized: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (sensitiveFields.includes(key.toLowerCase())) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitize(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { headers, body, query, url, method } = request;

    const sanitizedHeaders = this.sanitize(headers);
    const sanitizedBody = this.sanitize(body);

    this.logger.log(`Incoming Request: ${method} ${url}`);
    this.logger.debug(
      JSON.stringify({
        headers: sanitizedHeaders,
        body: sanitizedBody,
        query,
      }),
    );

    return next.handle();
  }
}
