import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsUUID()
  @IsNotEmpty()
  categoryId?: string;

  @IsUUID()
  @IsNotEmpty()
  authorId: string;
}
