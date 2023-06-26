import { IsNotEmpty } from 'class-validator';

export class CreateFollowDto {
  @IsNotEmpty()
  followerId: number;
  followingId: number;
}
