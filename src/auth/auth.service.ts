import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entity/auth.entity';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AppUtilities } from 'src/app.utilities';

export const roundsOfHashing = 10;

@Injectable()
export class AuthService {
  authorFields: any;
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async login(loginDto: LoginDto): Promise<AuthEntity> {
    const { email, password } = loginDto;
    const user = await this.prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
    });

    // If no user is found, throw an error
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    // Step 2: Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    // Step 3: Generate a JWT containing the user's ID and return it
    const accessToken: string = this.jwtService.sign({ userId: user.id });

    // Step 4: Remove password from sent data
    const pwd = 'password';
    const { [pwd]: _, ...usr } = user;

    return {
      accessToken,
      user: {
        ...usr,
      },
    };
  }

  async signup(createUserDto: CreateUserDto) {
    // eslint-disable-next-line prefer-const
    let { email, password, confirmPassword, ...data } = createUserDto;
    email = email.toLowerCase();
    const userExists = await this.prisma.user.findUnique({
      where: { email },
    });

    // If user is found, throw an error
    if (userExists) {
      throw new BadRequestException(`User ${email} already exists`);
    }

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const hashedPassword = await bcrypt.hash(password, roundsOfHashing);

    password = hashedPassword;

    const user = await this.prisma.user.create({
      data: {
        email,
        password,
        ...data,
      },
    });

    const pwd = 'password';
    const { [pwd]: _, ...usr } = user;

    return {
      user: {
        ...usr,
      },
      accessToken: this.jwtService.sign({ userId: user.id }),
    };
  }

  async changePassword(user: User, changePasswordDto: ChangePasswordDto) {
    const userId = user.id;
    const { oldPassword, newPassword, confirmNewPassword } = changePasswordDto;

    const foundUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!foundUser) throw new NotFoundException(`User not found`);

    const isPasswordValid = await AppUtilities.validator(
      oldPassword,
      foundUser.password,
    );

    if (!isPasswordValid)
      throw new BadRequestException(`Old password is incorrect`);

    if (newPassword !== confirmNewPassword)
      throw new BadRequestException(`Passwords do not match`);

    if (newPassword === oldPassword) {
      throw new BadRequestException(
        `New password cannot be the same as old password`,
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, roundsOfHashing);
    console.log(
      '🚀 ~ file: auth.service.ts:118 ~ AuthService ~ changePassword ~ hashedPassword:',
      hashedPassword,
    );

    const updatedUserPassword = await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });

    const pwd = 'password';
    const { [pwd]: _, ...usr } = updatedUserPassword;

    return { user: { ...usr } };
  }
}
