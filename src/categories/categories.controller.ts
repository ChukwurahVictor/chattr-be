import {
  Controller,
  UseInterceptors,
  UseGuards,
  Body,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ResponseInterceptor } from 'src/interceptors/response.interceptor';
import { ResponseMessage } from 'src/interceptors/response_message.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiBearerAuth()
@ApiTags('Categories')
@Controller('categories')
@UsePipes(new ValidationPipe())
@UseInterceptors(ResponseInterceptor)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ResponseMessage({ message: 'Categories fetched successfully' })
  async getCategories() {
    return await this.categoriesService.getAllCategories();
  }

  @Get(':id')
  @ResponseMessage({ message: 'Category fetched successfully' })
  async getCategory(@Param('id') id: string) {
    return await this.categoriesService.getACategory(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ResponseMessage({ message: 'Category created successfully' })
  async createCategory(
    @Body(ValidationPipe) createCategoryDto: CreateCategoryDto,
  ) {
    return await this.categoriesService.create(createCategoryDto);
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage({ message: 'Category updated successfully' })
  async updateCategory(
    @Param('id') id: string,
    @Body(ValidationPipe) updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoriesService.updateCategory(id, updateCategoryDto);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage({ message: 'Category deleted successfully' })
  async removeCategory(@Param('id') id: string) {
    return await this.categoriesService.removeCategory(id);
  }
}
