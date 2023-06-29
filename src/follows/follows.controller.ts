import { Controller, UseInterceptors, UseGuards, Body, Param, Post, Get } from '@nestjs/common';
import { ResponseInterceptor } from 'src/interceptors/response.interceptor';
import { ResponseMessage } from 'src/interceptors/response_message.decorator';
import { FollowsService } from './follows.service';
import { CreateFollowDto } from './dto/create-follow.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('follows')
@UseInterceptors(ResponseInterceptor)
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Follow created successfully')
  async createFollow(@Body() CreateFollowDto: CreateFollowDto) {
    return await this.followsService.createFollow(CreateFollowDto);
  }

  @Get('/:id/followers')
  @ResponseMessage('Followers fetched successfully')
  async getFollowers(@Param('id') id: string) {
    return await this.followsService.getFollowers(id);
  }

  @Get('/:id/following')
  @ResponseMessage('Following fetched successfully')
  async getFollowing(@Param('id') id: string) {
    return await this.followsService.getFollowing(id);
  }
}
