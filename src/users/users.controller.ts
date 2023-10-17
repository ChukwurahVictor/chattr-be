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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Users')
@UsePipes(new ValidationPipe())
@Controller('users')
@UseInterceptors(ResponseInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ResponseMessage({ message: 'Users fetched Successfully' })
  async getUsers() {
    return this.usersService.findAllUsers();
  }

  @Get('reactions')
  @ResponseMessage({ message: 'Users reactions fetched Successfully' })
  async getUserReactions(@Param('id') id: string) {
    return 'Fetch user reactions';
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage({ message: 'User fetched Successfully' })
  async getSingleUser(@Param('id') id: string) {
    return this.usersService.findOneUser(id);
  }

  @Get('/:id/posts')
  @ResponseMessage({ message: 'Users posts fetched Successfully' })
  async getUserPosts(@Param('id') id: string) {
    return this.usersService.getUserPosts(id);
  }

  @Get('/:id/follows')
  @ResponseMessage({ message: 'Users follows fetched Successfully' })
  async getUserFollows(@Param('id') id: string) {
    return this.usersService.getUserFollows(id);
  }

  @Patch()
  @ResponseMessage({ message: 'User updated Successfully' })
  async updateUser(
    @Param('id') id: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete()
  @ResponseMessage({ message: 'Users removed Successfully' })
  async removeUser(@Param('id') id: string) {
    return this.usersService.removeUser(id);
  }
}
