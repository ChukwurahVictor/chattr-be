import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePostDto } from './dto/update-post.dto';
export declare const roundsOfHashing = 10;
export declare class PostsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createPostDto: any): Promise<import("@prisma/client/runtime").GetResult<{
        id: string;
        title: string;
        content: string;
        image: string;
        authorId: string;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {}>;
    findAllPosts(): Promise<any>;
    findOnePost(id: string): Promise<{
        author: import("@prisma/client/runtime").GetResult<{
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            password: string;
            displayName: string;
            createdAt: Date;
            updatedAt: Date;
        }, unknown, never> & {};
        comments: (import("@prisma/client/runtime").GetResult<{
            id: string;
            postId: string;
            body: string;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
        }, unknown, never> & {})[];
    } & import("@prisma/client/runtime").GetResult<{
        id: string;
        title: string;
        content: string;
        image: string;
        authorId: string;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {}>;
    updatePost(id: string, updatePostDto: UpdatePostDto): Promise<any>;
    removePost(id: string): Promise<"Error deleting post" | "Post successfully removed">;
    addPostToCategory(postId: string, categoryId: string): Promise<void>;
}
