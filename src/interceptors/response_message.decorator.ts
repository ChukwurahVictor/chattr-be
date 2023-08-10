import { SetMetadata } from '@nestjs/common';
import { ResponseOptions } from './response.interceptor';

export const ResponseMessage = (options: ResponseOptions) =>
  SetMetadata('response_message', options);
