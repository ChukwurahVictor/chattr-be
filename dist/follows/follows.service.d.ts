import { PrismaService } from 'src/prisma/prisma.service';
export declare class FollowsService {
    private prisma;
    constructor(prisma: PrismaService);
    createFollow(createFollowDto: any): Promise<import("@prisma/client/runtime").GetResult<{
        followerId: string;
        followingId: string;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {}>;
    unFollow(): Promise<void>;
    getFollowing(id: string): Promise<({
        following: ({
            following: import("@prisma/client/runtime").GetResult<{
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
    }, unknown, never> & {})[]>;
    getFollowers(id: string): Promise<({
        followedBy: ({
            follower: import("@prisma/client/runtime").GetResult<{
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
    }, unknown, never> & {})[]>;
}
