import { Controller, UseInterceptors, UseGuards, Body, Post, Get, Patch, Delete, Param } from '@nestjs/common'
import { ResponseInterceptor } from 'src/interceptors/response.interceptor';
import { ResponseMessage } from 'src/interceptors/response_message.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
@UseInterceptors(ResponseInterceptor)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Category created successfully')
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ResponseMessage('Categories fetched successfully')
  async getCategories() {
    return await this.categoriesService.getAllCategories();
  }

  @Get(':id')
  @ResponseMessage('Category fetched successfully')
  async getCategory(@Param('id') id: string) {
    return await this.categoriesService.getACategory(id);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Category updated successfully')
  async updateCategory() {
    return await this.categoriesService.updateCategory();
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Category deleted successfully')
  async removeCategory() {
    return await this.categoriesService.removeCategory();
  }
}