import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddPostToCategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  postId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  categoryId: string;
}
