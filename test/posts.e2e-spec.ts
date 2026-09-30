import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('Posts (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;

  const authorUser = {
    id: 'author-1',
    email: 'author@example.com',
    displayName: 'Author',
  };

  const otherUser = {
    id: 'other-2',
    email: 'other@example.com',
    displayName: 'Other',
  };

  const mockPosts: any[] = [
    {
      id: 'post-1',
      title: 'First Post',
      content: 'Hello World',
      image: 'img.png',
      authorId: 'author-1',
      author: { id: 'author-1', displayName: 'Author' },
      categories: [],
      comments: [],
      likes: [],
    },
  ];

  const mockPrismaService = {
    $connect: jest.fn().mockResolvedValue(undefined),
    $disconnect: jest.fn().mockResolvedValue(undefined),
    enableShutdownHooks: jest.fn(),
    user: {
      findUnique: jest.fn((args: any) => {
        if (args.where.id === 'author-1') return Promise.resolve(authorUser);
        if (args.where.id === 'other-2') return Promise.resolve(otherUser);
        return Promise.resolve(null);
      }),
    },
    category: {
      findFirst: jest.fn().mockResolvedValue({ id: 'cat-1', name: 'General' }),
    },
    post: {
      count: jest.fn().mockImplementation(() => Promise.resolve(mockPosts.length)),
      findMany: jest.fn().mockResolvedValue(mockPosts),
      findUnique: jest.fn((args: any) => {
        const found = mockPosts.find((p) => p.id === args.where.id);
        return Promise.resolve(found || null);
      }),
      create: jest.fn((args: any) => {
        const newPost = {
          id: 'post-2',
          ...args.data,
          author: { id: authorUser.id, displayName: authorUser.displayName },
        };
        mockPosts.push(newPost);
        return Promise.resolve(newPost);
      }),
      delete: jest.fn((args: any) => {
        const idx = mockPosts.findIndex((p) => p.id === args.where.id);
        if (idx !== -1) {
          const deleted = mockPosts.splice(idx, 1)[0];
          return Promise.resolve(deleted);
        }
        return Promise.resolve(null);
      }),
    },
    posts_Categories: {
      create: jest.fn().mockResolvedValue({}),
      deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
    },
    comment: {
      deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
    reaction: {
      deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
    $transaction: jest.fn((callback) => callback(mockPrismaService)),
  };

  let authorToken: string;
  let otherToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    jwtService = moduleFixture.get<JwtService>(JwtService);
    authorToken = jwtService.sign({ userId: authorUser.id });
    otherToken = jwtService.sign({ userId: otherUser.id });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /posts', () => {
    it('should return list of posts without requiring authentication', async () => {
      const response = await request(app.getHttpServer())
        .get('/posts')
        .expect(200);

      expect(response.body.data).toHaveProperty('pageEdges');
      expect(response.body.data.pageEdges.length).toBeGreaterThan(0);
      expect(response.body.data.pageEdges[0].node).toHaveProperty('title', 'First Post');
    });
  });

  describe('GET /posts/:id', () => {
    it('should return a single post by id', async () => {
      const response = await request(app.getHttpServer())
        .get('/posts/post-1')
        .expect(200);

      expect(response.body.data).toHaveProperty('id', 'post-1');
      expect(response.body.data.author).not.toHaveProperty('password');
    });
  });

  describe('POST /posts', () => {
    it('should reject unauthenticated post creation', async () => {
      await request(app.getHttpServer())
        .post('/posts')
        .send({
          title: 'Unauthorized Post',
          content: 'No Token',
          categoryId: '00000000-0000-0000-0000-000000000001',
        })
        .expect(401);
    });

    it('should create post when authenticated', async () => {
      const response = await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${authorToken}`)
        .send({
          title: 'Authenticated Post',
          content: 'Post Content',
          image: 'https://example.com/image.png',
          categoryId: '00000000-0000-0000-0000-000000000001',
        })
        .expect(201);

      expect(response.body.data).toHaveProperty('message', 'Post created successfully');
      expect(response.body.data.post).toHaveProperty('title', 'Authenticated Post');
    });
  });

  describe('DELETE /posts/:id', () => {
    it('should forbid deleting a post that does not belong to the user', async () => {
      await request(app.getHttpServer())
        .delete('/posts/post-1')
        .set('Authorization', `Bearer ${otherToken}`)
        .expect(403);
    });

    it('should allow author to delete their own post', async () => {
      await request(app.getHttpServer())
        .delete('/posts/post-1')
        .set('Authorization', `Bearer ${authorToken}`)
        .expect(200);
    });
  });
});
