import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
// import { CreatePostDto } from './dto/create-user.dto';
// import { UpdatePostDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

export const roundsOfHashing = 10;

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto) {
    const findAuthor = await this.prisma.user.findUnique({ where: { id: createPostDto.authorId } });
    if (!findAuthor) {
      throw new HttpException('Author not found', HttpStatus.NOT_FOUND);
    }

    const titleExists = await this.prisma.post.findFirst({ where: { title: createPostDto.title } });
    if (titleExists) {
      throw new HttpException('Title already exists', HttpStatus.BAD_REQUEST);
    }

      // const category = await this.prisma.category.findFirst({
      //   where: { id: createPostDto.category },
      // });
      // if (!category) {
      //   return;
      // }

    return await this.prisma.post.create({
      data: createPostDto
    });

    // await this.prisma.posts_Categories.create({
    //   data: { categoryId: category.id, postId: post.id },
    // });

  }

  async findAllPosts() {
    const posts = await this.prisma.post.findMany({ include: {
      author: true
    }});
    return posts;
  }

  async findOnePost(id: string) {
    const post = await this.prisma.post.findUnique({ where: { id }, include: { author: true, comments: true } });

    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    return post;
    
  }

  async updatePost(id: string, updatePostDto) {
    const findPost = await this.prisma.post.findUnique({
      where: { id },
    });
    if (!findPost) {
      throw new HttpException('Author not found', HttpStatus.NOT_FOUND);
    }

    return await this.prisma.post.update({
      where: { id },
      data: updatePostDto,
    });
  }

  async removePost(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
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

    if (!deletePost) return 'Error deleting post';
    return 'Post successfully removed';
  }

  async addPostToCategory(postId: string, categoryId: string) {

  }

  // async getPostReactions(id: number) {

  // }
}
