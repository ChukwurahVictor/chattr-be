import { IsNotEmpty } from "class-validator";

export class CreatePostDto {
    @IsNotEmpty()
    title: String;

    @IsNotEmpty()
    body: string;

    // @IsNotEmpty()
    // categories: string[];

    @IsNotEmpty()
    authorId: number;
}