"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FollowsService = class FollowsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createFollow(createFollowDto) {
        const { followerId, followingId } = createFollowDto;
        const followerExists = await this.prisma.user.findUnique({ where: { id: followerId } });
        if (!followerExists) {
            throw new common_1.HttpException('Follower not found', common_1.HttpStatus.NOT_FOUND);
        }
        const followingExists = await this.prisma.user.findUnique({
            where: { id: followingId },
        });
        if (!followingExists) {
            throw new common_1.HttpException('Following not found', common_1.HttpStatus.NOT_FOUND);
        }
        const alreadyFollowing = await this.prisma.follows.findFirst({
            where: { followerId: followerId, followingId: followingId }
        });
        if (alreadyFollowing) {
            throw new common_1.HttpException('You already follow this user', common_1.HttpStatus.BAD_REQUEST);
        }
        return await this.prisma.follows.create({
            data: createFollowDto,
        });
    }
    async unFollow() {
    }
    async getFollowing(id) {
        const following = await this.prisma.user.findMany({
            where: { id: id },
            include: { following: { include: { following: true } } },
        });
        return following;
    }
    async getFollowers(id) {
        const followers = await this.prisma.user.findMany({
            where: { id: id },
            include: { followedBy: { include: { follower: true } } }
        });
        return followers;
    }
};
FollowsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FollowsService);
exports.FollowsService = FollowsService;
//# sourceMappingURL=follows.service.js.map