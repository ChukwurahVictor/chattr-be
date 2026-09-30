import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { PrismaService } from '../prisma/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('CommentsService', () => {
  let service: CommentsService;
  let prisma: any;

  const mockPrismaService = {
    post: {
      findUnique: jest.fn(),
    },
    comment: {
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockUser: any = {
    id: 'user-1',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a comment successfully', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue({ id: 'post-1' });
      mockPrismaService.comment.create.mockResolvedValue({
        id: 'comment-1',
        body: 'Great post!',
        user: { id: 'user-1', displayName: 'User One' },
      });

      const result = await service.create(
        { body: 'Great post!' },
        mockUser,
        'post-1',
      );

      expect(result.id).toBe('comment-1');
      expect(result.user).not.toHaveProperty('password');
    });

    it('should throw NotFoundException if post not found', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(null);

      await expect(
        service.create({ body: 'Hello' }, mockUser, 'non-existent'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should allow comment author to delete comment', async () => {
      mockPrismaService.comment.findUnique.mockResolvedValue({
        id: 'comment-1',
        userId: 'user-1',
        post: { authorId: 'post-author' },
      });
      mockPrismaService.comment.delete.mockResolvedValue({});

      const result = await service.remove('comment-1', mockUser);
      expect(result).toBe('Comment deleted successfully');
    });

    it('should allow post author to delete comment on their post', async () => {
      const postAuthor: any = { id: 'post-author' };
      mockPrismaService.comment.findUnique.mockResolvedValue({
        id: 'comment-1',
        userId: 'comment-author',
        post: { authorId: 'post-author' },
      });
      mockPrismaService.comment.delete.mockResolvedValue({});

      const result = await service.remove('comment-1', postAuthor);
      expect(result).toBe('Comment deleted successfully');
    });

    it('should throw ForbiddenException if user is neither comment author nor post author', async () => {
      const randomUser: any = { id: 'random-user' };
      mockPrismaService.comment.findUnique.mockResolvedValue({
        id: 'comment-1',
        userId: 'comment-author',
        post: { authorId: 'post-author' },
      });

      await expect(service.remove('comment-1', randomUser)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
