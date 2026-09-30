import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  const mockUsers: any[] = [];

  const mockPrismaService = {
    $connect: jest.fn().mockResolvedValue(undefined),
    $disconnect: jest.fn().mockResolvedValue(undefined),
    enableShutdownHooks: jest.fn(),
    user: {
      findUnique: jest.fn((args: any) => {
        if (args.where.email) {
          return Promise.resolve(
            mockUsers.find((u) => u.email === args.where.email) || null,
          );
        }
        if (args.where.id) {
          return Promise.resolve(
            mockUsers.find((u) => u.id === args.where.id) || null,
          );
        }
        return Promise.resolve(null);
      }),
      findFirst: jest.fn((args: any) => {
        const email = args?.where?.email?.equals || args?.where?.email;
        if (email) {
          return Promise.resolve(
            mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null,
          );
        }
        return Promise.resolve(null);
      }),
      create: jest.fn((args: any) => {
        const newUser = {
          id: `user-${mockUsers.length + 1}`,
          ...args.data,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        mockUsers.push(newUser);
        return Promise.resolve(newUser);
      }),
      update: jest.fn((args: any) => {
        const idx = mockUsers.findIndex((u) => u.id === args.where.id);
        if (idx !== -1) {
          mockUsers[idx] = { ...mockUsers[idx], ...args.data };
          return Promise.resolve(mockUsers[idx]);
        }
        return Promise.resolve(null);
      }),
    },
  };

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
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/signup', () => {
    it('should register a new user and return an accessToken', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          firstName: 'E2E',
          lastName: 'User',
          displayName: 'e2euser',
          email: 'e2e@example.com',
          password: 'Password123',
          confirmPassword: 'Password123',
        })
        .expect(201);

      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data.user).toHaveProperty('email', 'e2e@example.com');
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('should fail with 400 when passwords do not match', async () => {
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          firstName: 'E2E',
          lastName: 'User',
          displayName: 'e2euser2',
          email: 'e2e2@example.com',
          password: 'Password123',
          confirmPassword: 'MismatchPassword123',
        })
        .expect(400);
    });

    it('should fail with 400 if user email already exists', async () => {
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          firstName: 'E2E',
          lastName: 'User',
          displayName: 'e2euser',
          email: 'e2e@example.com',
          password: 'Password123',
          confirmPassword: 'Password123',
        })
        .expect(400);
    });
  });

  describe('POST /auth/login', () => {
    it('should login and return a valid JWT accessToken', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'e2e@example.com',
          password: 'Password123',
        })
        .expect(201);

      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('should reject login with wrong password', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'e2e@example.com',
          password: 'WrongPassword123',
        })
        .expect(401);
    });
  });

  describe('PATCH /auth/update-password', () => {
    it('should require authentication token', async () => {
      await request(app.getHttpServer())
        .patch('/auth/update-password')
        .send({
          oldPassword: 'Password123',
          newPassword: 'NewPassword123',
          confirmNewPassword: 'NewPassword123',
        })
        .expect(401);
    });

    it('should change password successfully with valid token', async () => {
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'e2e@example.com',
          password: 'Password123',
        });

      const token = loginRes.body.data.accessToken;

      await request(app.getHttpServer())
        .patch('/auth/update-password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          oldPassword: 'Password123',
          newPassword: 'NewPassword123',
          confirmNewPassword: 'NewPassword123',
        })
        .expect(200);
    });
  });
});
