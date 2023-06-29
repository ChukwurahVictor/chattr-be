import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    createPost(createCommentDto: CreateCommentDto): Promise<import("@prisma/client/runtime").GetResult<{
        id: string;
        postId: string;
        body: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {}>;
}
