import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create() {
    return "Create Categories";
  }

  async getAllCategories() {
    return 'Get all Categories';
  }

  async getACategory() {
    return 'Get a Category';
  }

  async updateCategory() {
    return 'Update Category';
  }

  async removeCategory() {
    return 'Delete Category';
  }
}