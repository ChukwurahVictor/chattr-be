import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';

export interface Response<T> {
  data: T;
}

export interface ResponseOptions {
  statusCode?: number;
  message?: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(private reflector: Reflector = new Reflector()) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const responseOptions = this.reflector.getAllAndOverride<ResponseOptions>(
      'response_message',
      [context.getHandler(), context.getClass()],
    );

    const httpResponse = context.switchToHttp().getResponse();
    const message = responseOptions?.message;
    const statusCode = responseOptions?.statusCode || httpResponse.statusCode;
    if (responseOptions?.statusCode) {
      httpResponse.status(responseOptions.statusCode);
    }

    return next.handle().pipe(
      map((data) => ({
        statusCode,
        message,
        data,
      })),
    );
  }
}
