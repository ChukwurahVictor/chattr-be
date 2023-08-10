import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { IsNotEmpty, IsOptional, IsString, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  title?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  content?: string;

  // @ApiPropertyOptional()
  // @IsOptional()
  // @IsNotEmpty()
  // categories?: string[];

  // @ApiProperty()
  // @IsString()
  // authorId: any;
}
