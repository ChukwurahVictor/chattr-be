import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';



@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAllUsers() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async findOneUser(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { posts: { include: { author: true } }, followedBy: true, following: true },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async removeUser(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const deleteUser = await this.prisma.$transaction(async (prisma) => {
      await prisma.post.deleteMany({
        where: {
          authorId: id,
        },
      });

      await prisma.reaction.deleteMany({
        where: {
          userId: id,
        },
      });

      await prisma.follows.deleteMany({
        where: {
          followerId: id,
          followingId: id,
        },
      });

      const deletedUser = await this.prisma.user.delete({
        where: {
          id: id,
        },
      });

      return deletedUser;
    });

    if (!deleteUser) return 'Error deleting user';
    return 'User successfully removed';
  }

  async getUserPosts(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { posts: true },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }
}
