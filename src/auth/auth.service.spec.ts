import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: any;
  let jwtService: any;

  const mockPrismaService = {
    user: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock_jwt_token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    jest.clearAllMocks();
  });

  describe('signup', () => {
    const signupDto = {
      firstName: 'John',
      lastName: 'Doe',
      displayName: 'johndoe',
      email: 'john@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
    };

    it('should successfully sign up a new user', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockImplementation((args: any) =>
        Promise.resolve({
          id: 'user-123',
          ...args.data,
        }),
      );

      const result = await service.signup(signupDto);

      expect(result).toHaveProperty('accessToken', 'mock_jwt_token');
      expect(result.user).toHaveProperty('email', 'john@example.com');
      expect(result.user).not.toHaveProperty('password');
      expect(mockPrismaService.user.create).toHaveBeenCalled();
    });

    it('should throw BadRequestException if user email already exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 'existing-id', email: 'john@example.com' });

      await expect(service.signup(signupDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if passwords do not match', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.signup({ ...signupDto, confirmPassword: 'DifferentPassword123!' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('should successfully login and return access token', async () => {
      const hashedPassword = await bcrypt.hash('Password123!', 10);
      const mockUser = {
        id: 'user-123',
        email: 'john@example.com',
        password: hashedPassword,
        displayName: 'johndoe',
        firstName: 'John',
        lastName: 'Doe',
      };

      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);

      const result = await service.login({ email: 'john@example.com', password: 'Password123!' });

      expect(result.accessToken).toBe('mock_jwt_token');
      expect(result.user).not.toHaveProperty('password');
      expect(result.user.id).toBe('user-123');
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);

      await expect(
        service.login({ email: 'unknown@example.com', password: 'Password123!' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const hashedPassword = await bcrypt.hash('CorrectPassword123!', 10);
      mockPrismaService.user.findFirst.mockResolvedValue({
        id: 'user-123',
        email: 'john@example.com',
        password: hashedPassword,
      });

      await expect(
        service.login({ email: 'john@example.com', password: 'WrongPassword!' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('changePassword', () => {
    it('should successfully update password', async () => {
      const oldHash = await bcrypt.hash('OldPassword123!', 10);
      const mockUser = {
        id: 'user-123',
        password: oldHash,
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.update.mockResolvedValue({
        id: 'user-123',
        displayName: 'johndoe',
        password: 'new_hashed_password',
      });

      const result = await service.changePassword(
        { id: 'user-123' } as any,
        {
          oldPassword: 'OldPassword123!',
          newPassword: 'NewPassword123!',
          confirmNewPassword: 'NewPassword123!',
        },
      );

      expect(result.user).not.toHaveProperty('password');
      expect(mockPrismaService.user.update).toHaveBeenCalled();
    });

    it('should throw BadRequestException if old password is incorrect', async () => {
      const oldHash = await bcrypt.hash('RealOldPassword123!', 10);
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 'user-123', password: oldHash });

      await expect(
        service.changePassword(
          { id: 'user-123' } as any,
          {
            oldPassword: 'WrongOldPassword123!',
            newPassword: 'NewPassword123!',
            confirmNewPassword: 'NewPassword123!',
          },
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if new password equals old password', async () => {
      const oldHash = await bcrypt.hash('SamePassword123!', 10);
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 'user-123', password: oldHash });

      await expect(
        service.changePassword(
          { id: 'user-123' } as any,
          {
            oldPassword: 'SamePassword123!',
            newPassword: 'SamePassword123!',
            confirmNewPassword: 'SamePassword123!',
          },
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
