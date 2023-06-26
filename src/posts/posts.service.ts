import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
// import { CreatePostDto } from './dto/create-user.dto';
// import { UpdatePostDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

export const roundsOfHashing = 10;

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto) {
    try {
      const findAuthor = await this.prisma.user.findUnique({ where: { id: createPostDto.authorId } });
      if (!findAuthor) {
        throw new HttpException('Author not found', HttpStatus.NOT_FOUND);
      }
  
      return await this.prisma.post.create({
        data: createPostDto,
      });
    } catch (error) {
      return error;
    }
  }

  async findAllPosts() {
    try {
      const posts = await this.prisma.post.findMany({ include: {
        author: true
      }});
      return posts;
    } catch (error) {
      return error;
    }
  }

  async findOnePost(id: number) {
    try {
      const post = await this.prisma.post.findUnique({ where: { id }, include: { author: true, comments: true } });
  
      if (!post) {
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
      }
      return post;
    } catch (error) {
      return error;
    }
  }

  async updatePost(id: number, updatePostDto: UpdatePostDto) {
    try {
      const findAuthor = await this.prisma.user.findUnique({
        where: { id: updatePostDto.authorId },
      });
      if (!findAuthor) {
        throw new HttpException('Author not found', HttpStatus.NOT_FOUND);
      }
  
      return await this.prisma.post.update({
        where: { id },
        data: updatePostDto,
      });
    } catch (error) {
      return error;
    }
  }

  async removePost(id: number) {
    try {
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
    } catch (error) {
      return error;
    }
  }

  // async getPostReactions(id: number) {

  // }
}
