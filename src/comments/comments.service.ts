import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(createCommentDto) {
    const findPost = await this.prisma.post.findUnique({
      where: { id: createCommentDto.postId },
    });
    if (!findPost) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    return await this.prisma.comment.create({
      data: createCommentDto,
    });
  }
  async remove(id: string) {
    const findComment = await this.prisma.comment.findUnique({
      where: { id: id },
    });
    if (!findComment) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }

    const deleteComment = await this.prisma.comment.delete({ where: { id: id } });

    if(!deleteComment) return 'Error deleting comment';
    return 'Comment deleted successfully';
  }
}