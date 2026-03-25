import { User } from '../user.entity';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(name: string, email: string, password: string): Promise<User>;
}