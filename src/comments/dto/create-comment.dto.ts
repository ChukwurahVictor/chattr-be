import { IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
    
    @IsNotEmpty()
    body: string;
    
    @IsNotEmpty()
    postId: number;
    
    @IsNotEmpty()
    userId: String;
}
