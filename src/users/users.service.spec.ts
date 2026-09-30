import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: any;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    post: {
      findMany: jest.fn(),
      deleteMany: jest.fn(),
    },
    comment: {
      deleteMany: jest.fn(),
    },
    reaction: {
      deleteMany: jest.fn(),
    },
    follows: {
      deleteMany: jest.fn(),
    },
    posts_Categories: {
      deleteMany: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(mockPrismaService)),
  };

  const mockCurrentUser: any = {
    id: 'user-1',
    email: 'user1@example.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('findUserById', () => {
    it('should return user without password', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'user1@example.com',
        displayName: 'User One',
      });

      const user = await service.findUserById('user-1');
      expect(user.id).toBe('user-1');
      expect(user).not.toHaveProperty('password');
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.findUserById('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateUser', () => {
    it('should update user profile when authorized', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 'user-1' });
      mockPrismaService.user.update.mockResolvedValue({
        id: 'user-1',
        displayName: 'Updated Name',
      });

      const updated = await service.updateUser(
        'user-1',
        { displayName: 'Updated Name' } as any,
        mockCurrentUser,
      );

      expect(updated.displayName).toBe('Updated Name');
      expect(mockPrismaService.user.update).toHaveBeenCalled();
    });

    it('should throw ForbiddenException if user tries to update another profile', async () => {
      await expect(
        service.updateUser('other-user-id', { displayName: 'Hacked' } as any, mockCurrentUser),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('removeUser', () => {
    it('should safely cascade delete user data when authorized', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 'user-1' });
      mockPrismaService.post.findMany.mockResolvedValue([{ id: 'post-1' }]);
      mockPrismaService.user.delete.mockResolvedValue({ id: 'user-1' });

      const result = await service.removeUser('user-1', mockCurrentUser);

      expect(result).toBe('User successfully removed');
      expect(mockPrismaService.comment.deleteMany).toHaveBeenCalled();
      expect(mockPrismaService.reaction.deleteMany).toHaveBeenCalled();
      expect(mockPrismaService.follows.deleteMany).toHaveBeenCalledWith({
        where: {
          OR: [{ followerId: 'user-1' }, { followingId: 'user-1' }],
        },
      });
      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id: 'user-1' },
      });
    });

    it('should throw ForbiddenException if trying to delete another user', async () => {
      await expect(
        service.removeUser('other-user-id', mockCurrentUser),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
