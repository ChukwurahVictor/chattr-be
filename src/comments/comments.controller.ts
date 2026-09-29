import {
  Controller,
  UseInterceptors,
  UseGuards,
  Body,
  Post,
  Delete,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ResponseInterceptor } from 'src/interceptors/response.interceptor';
import { ResponseMessage } from 'src/interceptors/response_message.decorator';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from '@prisma/client';

@ApiBearerAuth()
@ApiTags('Comments')
@UsePipes(new ValidationPipe())
@Controller('comments')
@UseInterceptors(ResponseInterceptor)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('/:id')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage({ message: 'Comment created successfully' })
  async createComment(
    @Body(ValidationPipe) createCommentDto: CreateCommentDto,
    @GetUser() user: User,
    @Param('id') postId: string,
  ) {
    return await this.commentsService.create(createCommentDto, user, postId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage({ message: 'Comment deleted successfully' })
  async removeComment(
    @Param('id') id: string,
    @GetUser() user: User,
  ) {
    return await this.commentsService.remove(id, user);
  }
}
