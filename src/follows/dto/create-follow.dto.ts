import { IsNotEmpty } from 'class-validator';

export class CreateFollowDto {
  @IsNotEmpty()
  followerId: string;
  followingId: string;
}
