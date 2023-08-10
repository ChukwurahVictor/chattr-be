import {
  Controller,
  UseInterceptors,
  Body,
  Post,
  Get,
  Param,
  Delete,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { ResponseInterceptor } from 'src/interceptors/response.interceptor';
import { ResponseMessage } from 'src/interceptors/response_message.decorator';
import { ReactionsService } from './reactions.service';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Reactions')
@UsePipes(new ValidationPipe())
@Controller('reactions')
@UseInterceptors(ResponseInterceptor)
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Post()
  @ResponseMessage({ message: 'Reaction created successfully' })
  async createReaction(
    @Body(ValidationPipe) createReactionDto: CreateReactionDto,
  ) {
    return await this.reactionsService.create(createReactionDto);
  }

  @Get('/:postId')
  @ResponseMessage({ message: 'Reactions fetched successfully' })
  async getReactions(@Param('postId') postId: string) {
    return await this.reactionsService.getPostReactions(postId);
  }

  @Delete('/:id')
  @ResponseMessage({ message: 'Reaction deleted successfully' })
  async removeReaction(@Param('id') id: string) {
    return await this.reactionsService.removeReaction(id);
  }
}
