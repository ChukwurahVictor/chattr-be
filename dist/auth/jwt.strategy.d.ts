import { Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private usersService;
    constructor(usersService: UsersService);
    validate(payload: {
        userId: string;
    }): Promise<{
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
}
export {};
