import {
  Controller,
  Body,
  Delete,
  Get,
  Patch,
  Param,
  UseInterceptors,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ResponseInterceptor } from 'src/interceptors/response.interceptor';
import { ResponseMessage } from 'src/interceptors/response_message.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@UsePipes(new ValidationPipe())
@Controller('users')
@UseInterceptors(ResponseInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Users fetched Successfully')
  async getUsers() {
    return this.usersService.findAllUsers();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('User fetched Successfully')
  async getSingleUser(@Param('id') id: string) {
    return this.usersService.findOneUser(id);
  }

  @Patch()
  @ResponseMessage('User updated Successfully')
  async updateUser(
    @Param('id') id: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete()
  @ResponseMessage('Users removed Successfully')
  async removeUser(@Param('id') id: string) {
    return this.usersService.removeUser(id);
  }

  @Get(':id/posts')
  @ResponseMessage('Users posts fetched Successfully')
  async getUserPosts(@Param('id') id: string) {
    return this.usersService.getUserPosts(id);
  }

  @Get('reactions')
  @ResponseMessage('Users reactions fetched Successfully')
  async getUserReactions(id: string) {
    return 'Fetch user reactions';
  }

  @Get('follows')
  @ResponseMessage('Users reactions fetched Successfully')
  async getUserFollows(id: string) {
    return 'Fetch user follows';
  }
}
