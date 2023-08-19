import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
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
      'response message',
      [context.getHandler(), context.getClass()],
    );
    const message = responseOptions?.message;
    if (responseOptions?.statusCode) {
      context.switchToHttp().getResponse().status(responseOptions?.statusCode);
    }

    return next.handle().pipe(
      map((data) => {
        console.log(data);
        return {
          statusCode: responseOptions?.statusCode,
          message,
          data,
        };
      }),
    );
  }
}
