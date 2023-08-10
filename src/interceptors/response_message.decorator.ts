import { SetMetadata } from '@nestjs/common';

export const ResponseMessage = (options: string) =>
  SetMetadata('response_message', options);
