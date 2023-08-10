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
  Req,
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

@ApiBearerAuth()
@ApiTags('Posts')
@Controller('posts')
@UseInterceptors(ResponseInterceptor)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Post created successfully')
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @GetUser() user: User,
  ) {
    return await this.postsService.create(createPostDto, user);
  }

  @Get()
  @ResponseMessage('Posts fetched Successfully')
  async getPosts() {
    return this.postsService.findAllPosts();
  }

  @Get(':id')
  @ResponseMessage('Post fetched Successfully')
  async getSinglePost(@Param('id') id: string) {
    return this.postsService.findOnePost(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Post updated Successfully')
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.updatePost(id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Posts removed Successfully')
  async removePost(@Param('id') id: string) {
    return this.postsService.removePost(id);
  }

  @Delete('add-to-category')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Post added to category Successfully')
  async addPostToCategory(@Body() addPostToCategoryDto: AddPostToCategoryDto) {
    return this.postsService.addPostToCategory(addPostToCategoryDto);
  }
}
