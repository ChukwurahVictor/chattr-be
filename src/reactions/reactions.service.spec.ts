import { Test, TestingModule } from '@nestjs/testing';
import { ReactionsService } from './reactions.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';

describe('ReactionsService', () => {
  let service: ReactionsService;
  let prisma: any;

  const mockPrismaService = {
    post: {
      findUnique: jest.fn(),
    },
    reaction: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockUser: any = {
    id: 'user-1',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReactionsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ReactionsService>(ReactionsService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a reaction successfully', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue({ id: 'post-1' });
      mockPrismaService.reaction.findFirst.mockResolvedValue(null);
      mockPrismaService.reaction.create.mockResolvedValue({
        id: 'reaction-1',
        postId: 'post-1',
        userId: 'user-1',
      });

      const result = await service.create({ postId: 'post-1' }, mockUser);
      expect(result.id).toBe('reaction-1');
      expect(mockPrismaService.reaction.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException if post does not exist', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(null);

      await expect(
        service.create({ postId: 'non-existent' }, mockUser),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if user already reacted to post', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue({ id: 'post-1' });
      mockPrismaService.reaction.findFirst.mockResolvedValue({ id: 'existing-rx' });

      await expect(
        service.create({ postId: 'post-1' }, mockUser),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('removeReaction', () => {
    it('should allow user to remove their reaction', async () => {
      mockPrismaService.reaction.findUnique.mockResolvedValue({
        id: 'reaction-1',
        userId: 'user-1',
      });
      mockPrismaService.reaction.delete.mockResolvedValue({});

      const result = await service.removeReaction('reaction-1', mockUser);
      expect(result).toBe('Reaction successfully removed');
      expect(mockPrismaService.reaction.delete).toHaveBeenCalledWith({
        where: { id: 'reaction-1' },
      });
    });

    it('should throw ForbiddenException if user does not own the reaction', async () => {
      mockPrismaService.reaction.findUnique.mockResolvedValue({
        id: 'reaction-1',
        userId: 'other-user',
      });

      await expect(
        service.removeReaction('reaction-1', mockUser),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
