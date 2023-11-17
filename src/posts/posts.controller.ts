import {
  Controller,
  Body,
  Post,
  Delete,
  Get,
  Patch,
  UseInterceptors,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { ResponseInterceptor } from 'src/interceptors/response.interceptor';
import { ResponseMessage } from 'src/interceptors/response_message.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AddPostToCategoryDto } from 'src/categories/dto/add-post-category.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { PaginationSearchOptionsDto } from 'src/common/interfaces/pagination-search-options.dto';

@ApiBearerAuth()
@ApiTags('Posts')
@Controller('posts')
@UseInterceptors(ResponseInterceptor)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @ResponseMessage({ message: 'Posts fetched Successfully' })
  async getPosts(@Query() filterDto: PaginationSearchOptionsDto) {
    return this.postsService.findAllPosts(filterDto);
  }

  @Get('/:id')
  @ResponseMessage({ message: 'Post fetched Successfully' })
  async getSinglePost(@Param('id') id: string) {
    return this.postsService.findOnePost(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ResponseMessage({ message: 'Post created successfully' })
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @GetUser() user: User,
  ) {
    return await this.postsService.createPost(createPostDto, user);
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage({ message: 'Post updated Successfully' })
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @GetUser() user: User,
  ) {
    return this.postsService.updatePost(id, updatePostDto, user);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage({ message: 'Posts removed Successfully' })
  async removePost(@Param('id') id: string, @GetUser() user: User) {
    return this.postsService.removePost(id, user);
  }

  @Post('add-to-category')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage({ message: 'Post added to category Successfully' })
  async addPostToCategory(@Body() addPostToCategoryDto: AddPostToCategoryDto) {
    return this.postsService.addPostToCategory(addPostToCategoryDto);
  }
}
