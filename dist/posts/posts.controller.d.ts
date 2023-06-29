import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    createPost(createPostDto: CreatePostDto): Promise<import("@prisma/client/runtime").GetResult<{
        id: string;
        title: string;
        content: string;
        image: string;
        authorId: string;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {}>;
    getPosts(): Promise<any>;
    getSinglePost(id: string): Promise<{
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
}
