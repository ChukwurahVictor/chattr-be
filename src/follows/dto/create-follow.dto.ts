import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateFollowDto {
  // @ApiProperty()
  // @IsNotEmpty()
  // followerId: string;

  @ApiProperty()
  @IsNotEmpty()
  followingId: string;
}
