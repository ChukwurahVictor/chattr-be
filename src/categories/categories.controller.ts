import { Controller, UseInterceptors, Body, Post, Get, Patch, Delete } from '@nestjs/common'
import { ResponseInterceptor } from 'src/interceptors/response.interceptor';
import { ResponseMessage } from 'src/interceptors/response_message.decorator';
import { CategoriesService } from './categories.service';

@Controller('categories')
@UseInterceptors(ResponseInterceptor)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ResponseMessage('Category created successfully')
  async createCategory() {
    return await this.categoriesService.create();
  }

  @Get()
  @ResponseMessage('Categories fetched successfully')
  async getCategories() {
    return await this.categoriesService.create();
  }

  @Get()
  @ResponseMessage('Category fetched successfully')
  async getCategory() {
    return await this.categoriesService.create();
  }

  @Patch()
  @ResponseMessage('Category updated successfully')
  async updateCategory() {
    return await this.categoriesService.create();
  }

  @Delete()
  @ResponseMessage('Category deleted successfully')
  async removeCategory() {
    return await this.categoriesService.create();
  }
}