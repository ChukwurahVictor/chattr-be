import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FollowsService {
  constructor(private prisma: PrismaService) {}

  async createFollow(createFollowDto) {
    const { followerId, followingId } = createFollowDto;
    console.log(createFollowDto);

    const followerExists = await this.prisma.user.findUnique({ where: { id: followerId } });
    if (!followerExists) {
      throw new HttpException('Follower not found', HttpStatus.NOT_FOUND);
    }

    const followingExists = await this.prisma.user.findUnique({
      where: { id: followingId },
    });
    if (!followingExists) {
      throw new HttpException('Following not found', HttpStatus.NOT_FOUND);
    }

    const alreadyFollowing = await this.prisma.follows.findFirst({
      where: { followerId: followerId, followingId: followingId }
    })
    if (alreadyFollowing) {
      throw new HttpException('You already follow this user', HttpStatus.BAD_REQUEST);
    }

    return await this.prisma.follows.create({
      data: createFollowDto,
    });
  }

  async unFollow() {

  }

  async getFollowing(id: string) {
    const following = await this.prisma.user.findMany({
      where: { id: id },
      include: { following: { include: { following: true} }},
    });
    return following;
  }

  async getFollowers(id: string) {
    const followers = await this.prisma.user.findMany({ 
      where: { id: id }, 
      include: { followedBy: { include: { follower: true }} } 
    });
    return followers;
  }
}
