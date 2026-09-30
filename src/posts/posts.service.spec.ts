import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { PrismaService } from '../prisma/prisma.service';
import { ForbiddenException, HttpException, HttpStatus } from '@nestjs/common';

describe('PostsService', () => {
  let service: PostsService;
  let prisma: any;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
    category: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
    },
    post: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    posts_Categories: {
      create: jest.fn(),
      findFirst: jest.fn(),
      deleteMany: jest.fn(),
    },
    comment: {
      deleteMany: jest.fn(),
    },
    reaction: {
      deleteMany: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(mockPrismaService)),
  };

  const mockUser: any = {
    id: 'user-1',
    email: 'user1@example.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should successfully create a post', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 'user-1' });
      mockPrismaService.category.findFirst.mockResolvedValue({ id: 'cat-1' });
      mockPrismaService.post.create.mockResolvedValue({
        id: 'post-1',
        title: 'New Post',
        content: 'Content',
        image: 'img.png',
        author: { id: 'user-1', displayName: 'User One' },
      });
      mockPrismaService.posts_Categories.create.mockResolvedValue({});

      const result = (await service.createPost(
        {
          title: 'New Post',
          content: 'Content',
          image: 'img.png',
          categoryId: 'cat-1',
        },
        mockUser,
      )) as any;

      expect(result.message).toBe('Post created successfully');
      expect(result.post.id).toBe('post-1');
      expect(mockPrismaService.posts_Categories.create).toHaveBeenCalled();
    });

    it('should throw if category does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 'user-1' });
      mockPrismaService.category.findFirst.mockResolvedValue(null);

      await expect(
        service.createPost(
          {
            title: 'New Post',
            content: 'Content',
            categoryId: 'non-existent-cat',
          },
          mockUser,
        ),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('findOnePost', () => {
    it('should return a single post with author and comments', async () => {
      const mockPost = {
        id: 'post-1',
        title: 'Post 1',
        author: { id: 'user-1', email: 'author@test.com' },
        comments: [],
        likes: [],
      };
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost);

      const result = await service.findOnePost('post-1');
      expect(result.id).toBe('post-1');
      expect(result.author).not.toHaveProperty('password');
    });

    it('should throw NotFoundException if post not found', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(null);

      await expect(service.findOnePost('invalid-id')).rejects.toThrow(HttpException);
    });
  });

  describe('updatePost', () => {
    it('should allow author to update their post', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue({
        id: 'post-1',
        authorId: 'user-1',
        title: 'Old Title',
      });
      mockPrismaService.post.update.mockResolvedValue({
        id: 'post-1',
        title: 'New Title',
      });

      const result = await service.updatePost(
        'post-1',
        { title: 'New Title' },
        mockUser,
      );

      expect(result.title).toBe('New Title');
    });

    it('should throw ForbiddenException if user is not author', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue({
        id: 'post-1',
        authorId: 'user-other',
      });

      await expect(
        service.updatePost('post-1', { title: 'New Title' }, mockUser),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('removePost', () => {
    it('should allow author to delete post and its specific comments', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue({
        id: 'post-1',
        authorId: 'user-1',
      });
      mockPrismaService.post.delete.mockResolvedValue({ id: 'post-1' });

      const result = await service.removePost('post-1', mockUser);

      expect(result).toBe('Post successfully removed');
      expect(mockPrismaService.comment.deleteMany).toHaveBeenCalledWith({
        where: { postId: 'post-1' },
      });
      expect(mockPrismaService.post.delete).toHaveBeenCalledWith({
        where: { id: 'post-1' },
      });
    });

    it('should throw ForbiddenException if user is not author', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue({
        id: 'post-1',
        authorId: 'different-user',
      });

      await expect(service.removePost('post-1', mockUser)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
