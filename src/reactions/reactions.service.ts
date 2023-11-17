import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReactionsService {
  constructor(private prismaService: PrismaService) {}

  async create(postId: string, user: User) {
    const findPost = await this.prismaService.post.findUnique({
      where: { id: postId },
    });
    if (!findPost) throw new NotFoundException('Post not found');

    const userId = user.id;
    const findReaction = await this.prismaService.reaction.findFirst({
      where: {
        userId,
        postId,
      },
    });
    if (findReaction) {
      throw new HttpException(
        'Already reacted to post',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.prismaService.reaction.create({
      data: {
        post: { connect: { id: postId } },
        user: { connect: { id: userId } },
      },
    });
  }

  async getPostReactions(postId: string) {
    const reactions = await this.prismaService.post.findUnique({
      where: { id: postId },
      include: { likes: true },
    });

    if (!reactions) throw new NotFoundException('Reaction not found');

    if (!reactions.likes.length)
      throw new NotFoundException('No reactions found for this post');

    return reactions;
  }

  async removeReaction(id: string, user: User) {
    const reaction = await this.prismaService.reaction.findUnique({
      where: { id },
    });

    if (!reaction) throw new NotFoundException('Reaction not found');

    if (reaction.userId !== user.id)
      throw new ForbiddenException(
        'You are not allowed to delete this reaction',
      );

    return await this.prismaService.reaction.delete({ where: { id } });
  }
}
