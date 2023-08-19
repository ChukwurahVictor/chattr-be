import {
  Controller,
  UseInterceptors,
  UseGuards,
  Body,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ResponseInterceptor } from 'src/interceptors/response.interceptor';
import { ResponseMessage } from 'src/interceptors/response_message.decorator';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Comments')
@UsePipes(new ValidationPipe())
@Controller('comments')
@UseInterceptors(ResponseInterceptor)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Comment created successfully')
  async createPost(@Body(ValidationPipe) createCommentDto: CreateCommentDto) {
    return await this.commentsService.create(createCommentDto);
  }
}
