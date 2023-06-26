import {
  Controller,
  UseInterceptors,
  Body,
  Post,
  Get,
  Patch,
  Delete,
} from '@nestjs/common';
import { ResponseInterceptor } from 'src/interceptors/response.interceptor';
import { ResponseMessage } from 'src/interceptors/response_message.decorator';
import { ReactionsService } from './reactions.service';

@Controller('comments')
@UseInterceptors(ResponseInterceptor)
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Post()
  @ResponseMessage('Reaction created successfully')
  async createReaction() {
    return await this.reactionsService.create();
  }

  @Get()
  @ResponseMessage('Reactions fetched successfully')
  async getReactions() {
    return await this.reactionsService.getAllReactions();
  }

  @Get()
  @ResponseMessage('Reaction fetched successfully')
  async getReaction() {
    return await this.reactionsService.getAReaction();
  }

  @Patch()
  @ResponseMessage('Reaction updated successfully')
  async updateReaction() {
    return await this.reactionsService.updateReaction();
  }

  @Delete()
  @ResponseMessage('Reaction deleted successfully')
  async removeReaction() {
    return await this.reactionsService.removeReaction();
  }
}
