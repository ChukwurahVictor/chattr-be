import {
  Injectable,
  HttpException,
  HttpStatus,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { AppUtilities } from 'src/app.utilities';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateCategoryDto } from './dto/update-category.dto';
import * as moment from 'moment';

@Injectable()
export class CategoriesService {
  private authorFields: any;
  constructor(private prisma: PrismaService) {
    this.authorFields = AppUtilities.removePasswordForAuthorSelect();
  }

  async create(createCategoryDto) {
    const categoryExists = await this.prisma.category.findFirst({
      where: {
        name: createCategoryDto.name,
      },
    });
    if (categoryExists) {
      throw new ConflictException('Category already exists.');
    }
    return await this.prisma.category.create({ data: createCategoryDto });
  }

  async getAllCategories() {
    try {
      const categories = await this.prisma.category.findMany();
      return categories;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new BadRequestException(error.message);
    }
  }

  async getACategory(id: string) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id },
        include: {
          posts: {
            select: {
              post: {
                include: {
                  author: {
                    select: this.authorFields,
                  },
                  likes: true,
                  comments: {
                    include: {
                      user: {
                        select: this.authorFields,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!category) {
        throw new NotFoundException('Category not found.');
      }
      return category;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new BadRequestException(error.message);
    }
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const { name } = updateCategoryDto;
      const foundCategory = await this.prisma.category.findUnique({
        where: { id },
      });

      if (!foundCategory) {
        throw new NotFoundException('Category not found.');
      }

      const categoryExists = await this.prisma.category.findFirst({
        where: { id },
      });

      if (categoryExists && categoryExists.name === name) {
        throw new ConflictException('Category already exists.');
      }

      return await this.prisma.category.update({
        where: { id },
        data: { name, updatedAt: moment().toISOString() },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new BadRequestException(error.message);
    }
  }

  async removeCategory(id: string) {
    try {
      const foundCategory = await this.prisma.category.findUnique({
        where: { id },
        include: { posts: { select: { postId: true } } },
      });

      if (!foundCategory) {
        throw new NotFoundException('Category not found.');
      }

      const deleteCategoryInPost = foundCategory.posts.map(async (category) => {
        const updatedPost = await this.prisma.post.update({
          where: { id: category.postId },
          data: {
            categories: {
              deleteMany: { categoryId: foundCategory.id },
            },
          },
        });
        return updatedPost;
      });

      await Promise.all(deleteCategoryInPost);

      const deleteCategory = await this.prisma.category.delete({ where: { id } });
      return deleteCategory;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new BadRequestException(error.message);
    }
  }
}
