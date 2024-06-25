import { Injectable } from '@nestjs/common';
import { User } from './users.interface';
import { Role } from '../roles/role.enum';


@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      userId: 1,
      username: 'admin',
      password: 'changeme',
      role: Role.Admin,
    },
    {
      userId: 2,
      username: 'doctor',
      password: 'guess',
      role: Role.Doctor
    },
    {
      userId: 3,
      username: 'receptionist',
      password: 'try',
      role: Role.Receptionist
    },
    {
      userId: 4,
      username: 'patient',
      password: 'me',
      role: Role.Patient
    }
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }
}