import { Test, TestingModule } from '@nestjs/testing';
import { FollowsService } from './follows.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';

describe('FollowsService', () => {
  let service: FollowsService;
  let prisma: any;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    follows: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockFollower: any = {
    id: 'user-1',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FollowsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<FollowsService>(FollowsService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('createFollow', () => {
    it('should create a follow relationship successfully', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce({ id: 'user-1' });
      mockPrismaService.user.findUnique.mockResolvedValueOnce({ id: 'user-2' });
      mockPrismaService.follows.findFirst.mockResolvedValue(null);
      mockPrismaService.follows.create.mockResolvedValue({
        following: { id: 'user-2', displayName: 'User Two' },
      });

      const result = await service.createFollow('user-2', mockFollower);
      expect(result.following.id).toBe('user-2');
      expect(result.following).not.toHaveProperty('password');
    });

    it('should throw BadRequestException if user attempts to follow themselves', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 'user-1' });

      await expect(service.createFollow('user-1', mockFollower)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw if already following', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce({ id: 'user-1' });
      mockPrismaService.user.findUnique.mockResolvedValueOnce({ id: 'user-2' });
      mockPrismaService.follows.findFirst.mockResolvedValue({
        followerId: 'user-1',
        followingId: 'user-2',
      });

      await expect(service.createFollow('user-2', mockFollower)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('unFollow', () => {
    it('should unfollow a user successfully', async () => {
      mockPrismaService.follows.findFirst.mockResolvedValue({
        following: { id: 'user-2' },
      });
      mockPrismaService.follows.delete.mockResolvedValue({});

      const result = await service.unFollow('user-2', mockFollower);
      expect(result).toHaveProperty('wasFollowing');
    });

    it('should throw BadRequestException if not currently following', async () => {
      mockPrismaService.follows.findFirst.mockResolvedValue(null);

      await expect(service.unFollow('user-2', mockFollower)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
