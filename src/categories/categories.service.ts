import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto) {
    const categoryExists = await this.prisma.category.findFirst({ where: { name: createCategoryDto.name } });
    if (categoryExists) {
      throw new HttpException('Category already exists.', HttpStatus.BAD_REQUEST);
    }
    return await this.prisma.category.create({ data: createCategoryDto });
  }

  async getAllCategories() {
    try {
      const categories = await this.prisma.category.findMany();
      return categories;
    } catch (error) {
      throw new HttpException(`${error.message}`, HttpStatus.BAD_REQUEST);
    }
  }

  async getACategory(id: string) {
    try {
      const category = await this.prisma.category.findUnique({ where: {id: id} });
      if (!category) {
        throw new HttpException('Category not found.', HttpStatus.NOT_FOUND);
      }
      return category;
    } catch (error) {
      throw new HttpException(`${error.message}`, HttpStatus.BAD_REQUEST);
    }
  }

  async updateCategory() {
    try {
      return 'Update Category';
    } catch (error) {
      throw new HttpException(`${error.message}`, HttpStatus.BAD_REQUEST);
    }
  }

  async removeCategory() {
    try {
      return 'Delete Category';
    } catch (error) {
      throw new HttpException(`${error.message}`, HttpStatus.BAD_REQUEST);
    }
  }
}