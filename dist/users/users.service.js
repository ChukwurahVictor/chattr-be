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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAllUsers() {
        const users = await this.prisma.user.findMany();
        return users;
    }
    async findOneUser(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: { posts: { include: { author: true } }, followedBy: true, following: true },
        });
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        return user;
    }
    async updateUser(id, updateUserDto) {
        const user = await this.prisma.user.findUnique({
            where: { id }
        });
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        return await this.prisma.user.update({
            where: { id },
            data: updateUserDto,
        });
    }
    async removeUser(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        const deleteUser = await this.prisma.$transaction(async (prisma) => {
            await prisma.post.deleteMany({
                where: {
                    authorId: id,
                },
            });
            await prisma.reaction.deleteMany({
                where: {
                    userId: id,
                },
            });
            await prisma.follows.deleteMany({
                where: {
                    followerId: id,
                    followingId: id,
                },
            });
            const deletedUser = await this.prisma.user.delete({
                where: {
                    id: id,
                },
            });
            return deletedUser;
        });
        if (!deleteUser)
            return 'Error deleting user';
        return 'User successfully removed';
    }
    async getUserPosts(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: { posts: true },
        });
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        return user;
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map