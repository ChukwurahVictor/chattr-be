import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import * as moment from 'moment';
import { User } from '@prisma/client';
import { AppUtilities } from 'src/app.utilities';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(createCommentDto: CreateCommentDto, user: User, postId: string) {
    const { body } = createCommentDto;
    const findPost = await this.prisma.post.findUnique({
      where: { id: postId },
    });
    if (!findPost) {
      throw new NotFoundException('Post not found');
    }

    return await this.prisma.comment.create({
      data: {
        body: body,
        post: { connect: { id: findPost.id } },
        user: { connect: { id: user.id } },
        updatedAt: moment().toISOString(),
      },
      include: {
        user: {
          select: AppUtilities.removePasswordForAuthorSelect(),
        },
      },
    });
  }

  async remove(id: string, user: User) {
    const findComment = await this.prisma.comment.findUnique({
      where: { id },
      include: { post: true },
    });
    if (!findComment) {
      throw new NotFoundException('Comment not found');
    }

    if (findComment.userId !== user.id && findComment.post.authorId !== user.id) {
      throw new ForbiddenException(
        'You do not have permission to delete this comment',
      );
    }

    await this.prisma.comment.delete({
      where: { id },
    });

    return 'Comment deleted successfully';
  }
}
