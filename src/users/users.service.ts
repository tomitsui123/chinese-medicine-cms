import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];

  async findOne(username: string) {
    return this.users.find((user) => user.username === username);
  }

  async findOneById(id: number) {
    return this.users.find((user) => user.userId === id);
  }
}
