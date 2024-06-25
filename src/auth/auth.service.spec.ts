import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { Role } from '../roles/role.enum';

describe('Authrervice', () => {
  let service: AuthService;
  const users = [
    {
      userId: 1,
      username: 'admin',
      password: 'test',
      role: Role.Admin,
    },
    {
      userId: 2,
      username: 'doctor',
      password: 'test',
      role: Role.Doctor,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          global: true,
          secret: 'SECRET',
          signOptions: { expiresIn: '5h' },
        }),
      ],
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOne: jest
              .fn()
              .mockImplementation((username) =>
                users.find((user) => user.username === username),
              ),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('authentication test', () => {
    describe('when user is valid', () => {
      it('should return the user jwt', async () => {
        const username = 'admin';
        const password = 'test';
        const result = await service.signIn(username, password);
        expect(result).toBeDefined();
        expect(result).toHaveProperty('access_token');
      });
    });
    describe('when user is invalid', () => {
      it('should throw an unauthorized exception', async () => {
        const username = 'admin';
        const password = 'test1';
        try {
          await service.signIn(username, password);
        } catch (error) {
          expect(error).toBeDefined();
          expect(error.constructor.name).toBe('UnauthorizedException');
        }
      });
    });
  });

  describe('logout test', () => {
    let jwt: string;
    beforeAll(async () => {
      const username = 'admin';
      const password = 'test';
      const result = await service.signIn(username, password);
      jwt = result.access_token;
    });
    it('should return the message "logout success"', async () => {
      const result = await service.logout(jwt);
      const isNotValidate = service.isTokenBlacklisted(jwt);
      expect(result).toBeDefined();
      expect(result).toHaveProperty('message');
      expect(result.message).toBe('logout success');
      expect(isNotValidate).toBe(true);
    });
  });
});
