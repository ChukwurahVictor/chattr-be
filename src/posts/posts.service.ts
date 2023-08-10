import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateCategoryDto } from 'src/categories/dto/create-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import * as moment from 'moment';
import { User } from '@prisma/client';
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

    const titleExists = await this.prisma.post.findFirst({
      where: {
        title,
      },
    });
    if (titleExists) {
      throw new HttpException('Title already exists', HttpStatus.BAD_REQUEST);
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
    });

    await this.prisma.posts_Categories.create({
      data: {
        post: { connect: { id: post.id } },
        category: { connect: { id: category.id } },
      },
    });

    return 'Post created successfully.';
  }

  async findAllPosts() {
    const authorFields = this.createSelectObject([
      'id',
      'firstName',
      'lastName',
      'email',
      'displayName',
      'createdAt',
      'updatedAt',
    ]);

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
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
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

  createSelectObject(fields: string[]): Record<string, true> {
    return fields.reduce((selectObject, field) => {
      selectObject[field] = true;
      return selectObject;
    }, {});
  }
}
