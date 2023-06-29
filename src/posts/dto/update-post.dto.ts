import { PartialType } from "@nestjs/mapped-types";
import { CreatePostDto } from "./create-post.dto";
import { IsNotEmpty, IsOptional, IsString, IsEmail } from 'class-validator';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  title?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  body?: string;

//   @IsOptional()
//   @IsNotEmpty()
//   categories?: string[];

  @IsNotEmpty()
  authorId: string;
}