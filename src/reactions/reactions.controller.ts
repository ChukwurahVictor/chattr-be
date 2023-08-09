import {
  Controller,
  UseInterceptors,
  Body,
  Post,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { ResponseInterceptor } from 'src/interceptors/response.interceptor';
import { ResponseMessage } from 'src/interceptors/response_message.decorator';
import { ReactionsService } from './reactions.service';
import { CreateReactionDto } from './dto/create-reaction.dto';

@Controller('reactions')
@UseInterceptors(ResponseInterceptor)
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Post()
  @ResponseMessage('Reaction created successfully')
  async createReaction(@Body() createReactionDto: CreateReactionDto) {
    return await this.reactionsService.create(createReactionDto);
  }

  @Get('/:postId')
  @ResponseMessage('Reactions fetched successfully')
  async getReactions(@Param('postId') postId: string) {
    return await this.reactionsService.getPostReactions(postId);
  }

  @Delete('/:id')
  @ResponseMessage('Reaction deleted successfully')
  async removeReaction(@Param('id') id: string) {
    return await this.reactionsService.removeReaction(id);
  }
}
