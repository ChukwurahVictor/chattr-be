import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { AppUtilities } from 'src/app.utilities';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAllUsers() {
    const fields = AppUtilities.removePasswordForAuthorSelect();
    const users = await this.prisma.user.findMany({
      include: {
        followedBy: { include: { follower: { select: fields } } },
        following: { include: { following: { select: fields } } },
      },
    });
    const user = AppUtilities.removeSensitiveData(users, 'password');
    return user;
  }

  async findOneUser(id: string) {
    const fields = AppUtilities.removePasswordForAuthorSelect();
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        posts: { include: { author: true, comments: true, likes: true } },
        followedBy: { include: { follower: { select: fields } } },
        following: { include: { following: { select: fields } } },
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const pwd = 'password';
    const { [pwd]: _, ...usr } = user;

    return { ...usr };
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async removeUser(id: string) {
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

  async getUserPosts(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { posts: true },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const pwd = 'password';
    const { [pwd]: _, ...usr } = user;
    return { ...usr };
  }

  async getUserFollows(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { following: true },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const pwd = 'password';
    const { [pwd]: _, ...usr } = user;
    return { ...usr };
  }
}
