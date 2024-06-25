import { Role } from '../roles/role.enum';

export interface User {
  userId: number;
  username: string;
  password: string;
  role: Role;
}