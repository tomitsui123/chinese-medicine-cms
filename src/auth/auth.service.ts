import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LogoutResponse } from './auth.interface';

@Injectable()
export class AuthService {
  blackList: string[] = [];
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, password: string) {
    const user = await this.userService.findOne(username);
    if (!user || user.password !== password) throw new UnauthorizedException();

    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  logout(jwt: string): LogoutResponse {
    console.log(jwt);
    this.addToBlacklist(jwt);
    return { message: 'logout success' };
  }
  addToBlacklist(jwt: string) {
    this.blackList.push(jwt);
  }

  isTokenBlacklisted(jwt: string): boolean {
    return this.blackList.includes(jwt);
  }
}
