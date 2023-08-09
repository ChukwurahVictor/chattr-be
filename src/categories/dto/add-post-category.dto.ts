import { IsNotEmpty, IsString } from 'class-validator';

export class AddPostToCategoryDto {
  @IsNotEmpty()
  @IsString()
  postId: string;

  @IsNotEmpty()
  @IsString()
  categoryId: string;
}
