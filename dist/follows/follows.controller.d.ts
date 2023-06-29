import { FollowsService } from './follows.service';
import { CreateFollowDto } from './dto/create-follow.dto';
export declare class FollowsController {
    private readonly followsService;
    constructor(followsService: FollowsService);
    createFollow(CreateFollowDto: CreateFollowDto): Promise<import("@prisma/client/runtime").GetResult<{
        followerId: string;
        followingId: string;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {}>;
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
}
