import { PrismaService } from 'src/prisma/prisma.service';
export declare class CommentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createCommentDto: any): Promise<import("@prisma/client/runtime").GetResult<{
        id: string;
        postId: string;
        body: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {}>;
    remove(id: string): Promise<"Error deleting comment" | "Comment deleted successfully">;
}
