import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFollowDto } from './dto/create-follow.dto';
import { User } from '@prisma/client';
import { AppUtilities } from 'src/app.utilities';

@Injectable()
export class FollowsService {
  constructor(private prisma: PrismaService) {}

  async createFollow(id: string, follower: User) {
    const data = AppUtilities.removePasswordForAuthorSelect();
    const followerId = follower.id;

    const followerExists = await this.prisma.user.findUnique({
      where: {
        id: followerId,
      },
    });

    if (!followerExists) {
      throw new HttpException('Follower not found', HttpStatus.NOT_FOUND);
    }

    const followingExists = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!followingExists) {
      throw new HttpException('Following not found', HttpStatus.NOT_FOUND);
    }

    if (id === followerId)
      throw new BadRequestException(
        'You cannot follow yourself. Please select a different user to follow.',
      );

    const alreadyFollowing = await this.prisma.follows.findFirst({
      where: { followerId: followerId, followingId: id },
    });

    if (alreadyFollowing) {
      throw new HttpException(
        'You already follow this user',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.prisma.follows.create({
      data: {
        following: { connect: { id } },
        follower: { connect: { id: followerId } },
      },
      select: { following: { select: data } },
    });
  }

  async unFollow(id: string, follower: User) {
    const data = AppUtilities.removePasswordForAuthorSelect();
    const isFollowing = await this.prisma.follows.findFirst({
      where: { followerId: follower.id, followingId: id },
      select: { following: { select: data } },
    });

    if (!isFollowing) {
      throw new BadRequestException(
        'You are currently not following this user',
      );
    }

    const deleteUser = await this.prisma.follows.delete({
      where: {
        followerId_followingId: { followerId: follower.id, followingId: id },
      },
    });

    return {
      wasFollowing: isFollowing,
    };
  }

  async getFollowing(id: string) {
    const following = await this.prisma.follows.findMany({
      where: { followerId: id },
      include: { following: true },
    });
    return following;
  }

  async getFollowers(id: string) {
    const followers = await this.prisma.user.findMany({
      where: { id: id },
      include: { followedBy: { include: { follower: true } } },
    });
    return followers;
  }
}
