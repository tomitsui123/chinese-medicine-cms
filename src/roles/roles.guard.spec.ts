import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { ExecutionContext } from '@nestjs/common';

describe('RolesGuard', () => {
  let rolesGuard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    rolesGuard = new RolesGuard(reflector);
  });

  it('should be defined', () => {
    expect(rolesGuard).toBeDefined();
  });

  it('should allow access if no roles are defined', () => {
    const context = createMockExecutionContext({});
    jest.spyOn(reflector, 'get').mockReturnValue(undefined);

    const result = rolesGuard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should allow access if user has the required role', () => {
    const context = createMockExecutionContext({ roles: ['admin'] });
    jest.spyOn(reflector, 'get').mockReturnValue(['admin']);

    const result = rolesGuard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should deny access if user does not have the required role', () => {
    const context = createMockExecutionContext({ roles: ['user'] });
    jest.spyOn(reflector, 'get').mockReturnValue(['admin']);

    const result = rolesGuard.canActivate(context);
    expect(result).toBe(false);
  });

  function createMockExecutionContext(user: any): ExecutionContext {
    return {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user,
        }),
      }),
    } as unknown as ExecutionContext;
  }
});
