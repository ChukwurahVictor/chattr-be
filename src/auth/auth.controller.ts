import {
  UseInterceptors,
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ResponseInterceptor } from 'src/interceptors/response.interceptor';
import { ResponseMessage } from 'src/interceptors/response_message.decorator';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity } from './entity/auth.entity';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { User } from '@prisma/client';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';

@ApiBearerAuth()
@Controller('auth')
@UseInterceptors(ResponseInterceptor)
@UsePipes(new ValidationPipe())
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ResponseMessage({ message: 'User signed up successfully' })
  @ApiOkResponse({ type: AuthEntity })
  signup(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @Post('login')
  @ResponseMessage({ message: 'Login successful' })
  @ApiOkResponse({ type: AuthEntity })
  login(@Body(ValidationPipe) loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id/update-password')
  @ResponseMessage({ message: 'Password updated successfully' })
  changePassword(
    @GetUser() userId: User,
    @Body(ValidationPipe) updatePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(userId, updatePasswordDto);
  }
}
