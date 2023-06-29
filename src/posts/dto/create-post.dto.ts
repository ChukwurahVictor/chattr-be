import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreatePostDto {
    @IsNotEmpty()
    title: String;

    @IsNotEmpty()
    content: string;

    @IsOptional()
    @IsString()
    image?: string;

    // @IsNotEmpty()
    // categories: string[];

    @IsUUID()
    @IsNotEmpty()
    authorId: string;
}