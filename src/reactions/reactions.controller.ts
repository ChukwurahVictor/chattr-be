import {
  Controller,
  UseInterceptors,
  Post,
  Get,
  Param,
  Delete,
  ValidationPipe,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { ResponseInterceptor } from 'src/interceptors/response.interceptor';
import { ResponseMessage } from 'src/interceptors/response_message.decorator';
import { ReactionsService } from './reactions.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Reactions')
@UsePipes(new ValidationPipe())
@Controller('reactions')
@UseInterceptors(ResponseInterceptor)
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Get('/:id')
  @ResponseMessage({ message: 'Reactions fetched successfully' })
  async getReactions(@Param('id') postId: string) {
    return await this.reactionsService.getPostReactions(postId);
  }

  @Post('/:id')
  @ResponseMessage({ message: 'Reaction created successfully' })
  async createReaction(@Param('id') postId: string, @GetUser() userId: User) {
    return await this.reactionsService.create(postId, userId);
  }

  @Delete('/:id')
  @ResponseMessage({ message: 'Reaction deleted successfully' })
  async removeReaction(@Param('id') id: string, @GetUser() user: User) {
    return await this.reactionsService.removeReaction(id, user);
  }
}
