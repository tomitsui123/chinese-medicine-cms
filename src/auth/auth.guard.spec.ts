import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: JwtService,
          useValue: {
            verify: jest.fn(),
            verifyAsync: jest.fn().mockImplementation((token) => {
              if (token.includes('invalid')) throw new UnauthorizedException();
              return { username: 'admin', sub: 1 };
            }),
          },
        },
      ],
    }).compile();
    guard = module.get<AuthGuard>(AuthGuard);
  });
  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
  describe('canActivate', () => {
    describe('when token is valid', () => {
      it('should return true', async () => {
        const context = {
          switchToHttp: () => ({
            getRequest: () => ({
              headers: {
                authorization: 'Bearer token',
              },
            }),
          }),
        };
        const result = await guard.canActivate(context as any);
        expect(result).toBe(true);
      });
    });
    describe('when token is invalid', () => {
      it('should throw an error', async () => {
        const context = {
          switchToHttp: () => ({
            getRequest: () => ({
              headers: {
                authorization: 'Bearer invalidToken',
              },
            }),
          }),
        };
        await expect(guard.canActivate(context as any)).rejects.toThrow();
      });
    });
  });
});
