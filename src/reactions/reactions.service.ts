import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { AppUtilities } from 'src/app.utilities';

@Injectable()
export class ReactionsService {
  constructor(private prismaService: PrismaService) {}

  async create(target: string | CreateReactionDto, user: User) {
    const postId = typeof target === 'string' ? target : target.postId;

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
      throw new BadRequestException('Already reacted to post');
    }
    return await this.prismaService.reaction.create({
      data: {
        post: { connect: { id: postId } },
        user: { connect: { id: userId } },
      },
    });
  }

  async getPostReactions(postId: string) {
    const reactions = await this.prismaService.reaction.findMany({
      where: { postId },
      include: {
        user: {
          select: AppUtilities.removePasswordForAuthorSelect(),
        },
      },
    });
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

    await this.prismaService.reaction.delete({ where: { id } });
    return 'Reaction successfully removed';
  }
}
