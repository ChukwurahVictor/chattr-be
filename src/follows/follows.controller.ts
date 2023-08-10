import {
  Controller,
  UseInterceptors,
  UseGuards,
  Body,
  Param,
  Post,
  Get,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ResponseInterceptor } from 'src/interceptors/response.interceptor';
import { ResponseMessage } from 'src/interceptors/response_message.decorator';
import { FollowsService } from './follows.service';
import { CreateFollowDto } from './dto/create-follow.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from '@prisma/client';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Follows')
@UsePipes(new ValidationPipe())
@Controller('follows')
@UseInterceptors(ResponseInterceptor)
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Post('/:id')
  @ResponseMessage({ message: 'Follow created successfully' })
  async createFollow(@Param('id') id: string, @GetUser() user: User) {
    return await this.followsService.createFollow(id, user);
  }

  @Get('/:id/followers')
  @ResponseMessage({ message: 'Followers fetched successfully' })
  async getFollowers(@Param('id') id: string) {
    return await this.followsService.getFollowers(id);
  }

  @Get('/:id/following')
  @ResponseMessage({ message: 'Following fetched successfully' })
  async getFollowing(@Param('id') id: string) {
    return await this.followsService.getFollowing(id);
  }

  @Post('/:id/unfollow')
  @ResponseMessage({ message: 'Unfollowed User successfully' })
  async unfollow(@Param('id') id: string, @GetUser() user: User) {
    return await this.followsService.unFollow(id, user);
  }
}
