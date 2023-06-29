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
exports.PostsService = exports.roundsOfHashing = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
exports.roundsOfHashing = 10;
let PostsService = class PostsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createPostDto) {
        const findAuthor = await this.prisma.user.findUnique({ where: { id: createPostDto.authorId } });
        if (!findAuthor) {
            throw new common_1.HttpException('Author not found', common_1.HttpStatus.NOT_FOUND);
        }
        const titleExists = await this.prisma.post.findFirst({ where: { title: createPostDto.title } });
        if (titleExists) {
            throw new common_1.HttpException('Title already exists', common_1.HttpStatus.BAD_REQUEST);
        }
        console.log(createPostDto);
        return await this.prisma.post.create({
            data: createPostDto
        });
    }
    async findAllPosts() {
        try {
            const posts = await this.prisma.post.findMany({ include: {
                    author: true
                } });
            return posts;
        }
        catch (error) {
            return error;
        }
    }
    async findOnePost(id) {
        const post = await this.prisma.post.findUnique({ where: { id }, include: { author: true, comments: true } });
        if (!post) {
            throw new common_1.HttpException('Post not found', common_1.HttpStatus.NOT_FOUND);
        }
        return post;
    }
    async updatePost(id, updatePostDto) {
        try {
            const findAuthor = await this.prisma.user.findUnique({
                where: { id: updatePostDto.authorId },
            });
            if (!findAuthor) {
                throw new common_1.HttpException('Author not found', common_1.HttpStatus.NOT_FOUND);
            }
            return await this.prisma.post.update({
                where: { id },
                data: updatePostDto,
            });
        }
        catch (error) {
            return error;
        }
    }
    async removePost(id) {
        const post = await this.prisma.post.findUnique({
            where: { id },
        });
        if (!post) {
            throw new common_1.HttpException('Post not found', common_1.HttpStatus.NOT_FOUND);
        }
        const deletePost = await this.prisma.$transaction(async (prisma) => {
            await prisma.comment.deleteMany({
                where: {
                    postId: id,
                },
            });
            await prisma.reaction.deleteMany({
                where: {
                    postId: id,
                },
            });
            await prisma.posts_Categories.deleteMany({
                where: {
                    postId: id,
                },
            });
            const deletedPost = await this.prisma.post.delete({
                where: {
                    id: id,
                },
            });
            return deletedPost;
        });
        if (!deletePost)
            return 'Error deleting post';
        return 'Post successfully removed';
    }
    async addPostToCategory(postId, categoryId) {
    }
};
PostsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PostsService);
exports.PostsService = PostsService;
//# sourceMappingURL=posts.service.js.map