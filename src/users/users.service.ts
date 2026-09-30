import {
  Injectable,
  HttpException,
  HttpStatus,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { AppUtilities } from 'src/app.utilities';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findUserById(id: string) {
    const fields = AppUtilities.removePasswordForAuthorSelect();
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: fields,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

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
        posts: {
          include: {
            author: { select: fields },
            comments: {
              include: {
                user: { select: fields },
              },
            },
            likes: true,
          },
        },
        followedBy: { include: { follower: { select: fields } } },
        following: { include: { following: { select: fields } } },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const pwd = 'password';
    const { [pwd]: _, ...usr } = user;

    return { ...usr };
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto, currentUser: User) {
    if (currentUser.id !== id) {
      throw new ForbiddenException(
        'You do not have permission to update this profile',
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Ensure password is not updated via updateUser
    const { password: _, ...updateData } = updateUserDto as any;

    return await this.prisma.user.update({
      where: { id },
      data: updateData,
      select: AppUtilities.removePasswordForAuthorSelect(),
    });
  }

  async removeUser(id: string, currentUser: User) {
    if (currentUser.id !== id) {
      throw new ForbiddenException(
        'You do not have permission to delete this profile',
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const deleteUser = await this.prisma.$transaction(async (prisma) => {
      // 1. Delete comments written by the user
      await prisma.comment.deleteMany({
        where: { userId: id },
      });

      // 2. Delete reactions by the user
      await prisma.reaction.deleteMany({
        where: { userId: id },
      });

      // 3. Find user's posts to delete dependent records
      const userPosts = await prisma.post.findMany({
        where: { authorId: id },
        select: { id: true },
      });
      const postIds = userPosts.map((p) => p.id);

      if (postIds.length > 0) {
        await prisma.comment.deleteMany({
          where: { postId: { in: postIds } },
        });
        await prisma.reaction.deleteMany({
          where: { postId: { in: postIds } },
        });
        await prisma.posts_Categories.deleteMany({
          where: { postId: { in: postIds } },
        });
        await prisma.post.deleteMany({
          where: { id: { in: postIds } },
        });
      }

      // 4. Delete follow relationships where user is follower OR following
      await prisma.follows.deleteMany({
        where: {
          OR: [{ followerId: id }, { followingId: id }],
        },
      });

      // 5. Delete the user
      const deletedUser = await prisma.user.delete({
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
