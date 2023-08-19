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
  ValidationPipe,
  UsePipes,
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
@UsePipes(new ValidationPipe())
@Controller('posts')
@UseInterceptors(ResponseInterceptor)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ResponseMessage({ message: 'Post created successfully' })
  async createPost(
    @Body(ValidationPipe) createPostDto: CreatePostDto,
    @GetUser() user: User,
  ) {
    return await this.postsService.create(createPostDto, user);
  }

  @Get()
  @ResponseMessage({ message: 'Posts fetched Successfully' })
  async getPosts() {
    return this.postsService.findAllPosts();
  }

  @Get(':id')
  @ResponseMessage({ message: 'Post fetched Successfully' })
  async getSinglePost(@Param('id') id: string) {
    return this.postsService.findOnePost(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage({ message: 'Post updated Successfully' })
  async updatePost(
    @Param('id') id: string,
    @Body(ValidationPipe) updatePostDto: UpdatePostDto,
    @GetUser() user: User,
  ) {
    return this.postsService.updatePost(id, updatePostDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage({ message: 'Posts removed Successfully' })
  async removePost(@Param('id') id: string) {
    return this.postsService.removePost(id);
  }

  @Delete('add-to-category')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage({ message: 'Post added to category Successfully' })
  async addPostToCategory(
    @Body(ValidationPipe) addPostToCategoryDto: AddPostToCategoryDto,
  ) {
    return this.postsService.addPostToCategory(addPostToCategoryDto);
  }
}
