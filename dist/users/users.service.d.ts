import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAllUsers(): Promise<(import("@prisma/client/runtime").GetResult<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        displayName: string;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {})[]>;
    findOneUser(id: string): Promise<{
        posts: ({
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
        } & import("@prisma/client/runtime").GetResult<{
            id: string;
            title: string;
            content: string;
            image: string;
            authorId: string;
            createdAt: Date;
            updatedAt: Date;
        }, unknown, never> & {})[];
        followedBy: (import("@prisma/client/runtime").GetResult<{
            followerId: string;
            followingId: string;
            createdAt: Date;
            updatedAt: Date;
        }, unknown, never> & {})[];
        following: (import("@prisma/client/runtime").GetResult<{
            followerId: string;
            followingId: string;
            createdAt: Date;
            updatedAt: Date;
        }, unknown, never> & {})[];
    } & import("@prisma/client/runtime").GetResult<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        displayName: string;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {}>;
    updateUser(id: string, updateUserDto: UpdateUserDto): Promise<import("@prisma/client/runtime").GetResult<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        displayName: string;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {}>;
    removeUser(id: string): Promise<"Error deleting user" | "User successfully removed">;
    getUserPosts(id: string): Promise<{
        posts: (import("@prisma/client/runtime").GetResult<{
            id: string;
            title: string;
            content: string;
            image: string;
            authorId: string;
            createdAt: Date;
            updatedAt: Date;
        }, unknown, never> & {})[];
    } & import("@prisma/client/runtime").GetResult<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        displayName: string;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {}>;
}
