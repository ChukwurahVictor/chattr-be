import { ApiProperty } from '@nestjs/swagger';

export class AuthEntity {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    displayName: string;
  };
  @ApiProperty()
  accessToken: string;
}
