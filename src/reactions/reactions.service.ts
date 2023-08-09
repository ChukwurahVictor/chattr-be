import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReactionsService {
  constructor(private prismaService: PrismaService) {}

  async create(createReactionDto) {
    const { userId, postId } = createReactionDto;
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
      data: createReactionDto,
    });
  }

  async getPostReactions(postId: string) {
    const reactions = await this.prismaService.reaction.findMany({
      where: { postId },
    });
    return reactions;
  }

  async removeReaction(id: string) {
    const deleteReaction = await this.prismaService.reaction.delete({
      where: { id },
    });
    if (!deleteReaction) return 'Error deleting reaction';
    return 'Reaction successfully removed';
  }
}
