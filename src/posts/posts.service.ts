import {
  Injectable,
  HttpException,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { CreateCategoryDto } from 'src/categories/dto/create-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import * as moment from 'moment';
import { PrismaClient, User } from '@prisma/client';
import { UpdatePostDto } from './dto/update-post.dto';
import { AppUtilities } from 'src/app.utilities';
export const roundsOfHashing = 10;
// import { UpdatePostDto } from './dto/update-user.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto, user: User) {
    const { categoryId, title, image, content } = createPostDto;
    const authorId = user.id;

    const findAuthor = await this.prisma.user.findUnique({
      where: {
        id: authorId,
      },
    });
    if (!findAuthor) {
      throw new HttpException('Author not found', HttpStatus.NOT_FOUND);
    }

    const category = await this.prisma.category.findFirst({
      where: { id: categoryId },
    });

    if (!category) {
      throw new HttpException('Category not found!', HttpStatus.BAD_REQUEST);
    }

    const post = await this.prisma.post.create({
      data: {
        title,
        content,
        image,
        author: { connect: { id: authorId } },
        updatedAt: moment().toISOString(),
      },
      include: { author: true },
    });

    await this.prisma.posts_Categories.create({
      data: {
        post: { connect: { id: post.id } },
        category: { connect: { id: category.id } },
      },
    });

    return {
      message: 'Post created successfully',
      post,
    };
  }

  async findAllPosts() {
    const authorFields = AppUtilities.removePasswordForAuthorSelect();

    const posts = await this.prisma.post.findMany({
      include: {
        author: {
          select: authorFields,
        },
        comments: true,
        likes: true,
      },
    });
    return posts;
  }

  async findOnePost(id: string) {
    const authorFields = AppUtilities.removePasswordForAuthorSelect();
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: authorFields,
        },
        comments: {
          include: {
            user: true,
          },
        },
        likes: true,
      },
    });

    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    return post;
  }

  async updatePost(id: string, updatePostDto: UpdatePostDto, user: User) {
    const { ...data } = updatePostDto;
    const authorId = user.id;

    const findPost = await this.prisma.post.findUnique({
      where: { id },
    });
    if (!findPost) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    if (findPost.authorId !== authorId) {
      throw new ForbiddenException(
        'You do not have permission to edit this post.',
      );
    }

    return await this.prisma.post.update({
      where: { id },
      data: {
        ...data,
        updatedAt: moment().toISOString(),
      },
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
          OR: [
            { postId: id },
            { post: { authorId: post.authorId } }, // Deletes comments from the author
          ],
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

      const deletedPost = await prisma.post.delete({
        where: {
          id,
        },
      });

      return deletedPost;
    });

    if (!deletePost) {
      return 'Error deleting post';
    }

    return 'Post successfully removed';
  }

  async addPostToCategory(addPostToCategoryDto) {
    const { postId, categoryId } = addPostToCategoryDto;

    const findPost = await this.prisma.post.findUnique({
      where: { id: postId },
    });
    if (!findPost)
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    const findCategory = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!findCategory)
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);

    const postExists = await this.prisma.posts_Categories.findFirst({
      where: { postId, categoryId },
    });

    if (postExists)
      throw new HttpException(
        'Post already belong to category',
        HttpStatus.BAD_REQUEST,
      );

    await this.prisma.posts_Categories.create({
      data: addPostToCategoryDto,
    });

    return 'Post added successfully';
  }
}
