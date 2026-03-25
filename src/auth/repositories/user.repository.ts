import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { IUserRepository } from 'src/auth/interfaces/user.repository.interface';
import { User } from 'src/auth/user.entity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOneBy({ email });
  }

  async create(name: string, email: string, password: string): Promise<User> {
    const hashed = await bcrypt.hash(password, 10);
    const user = this.repo.create({ name, email, password: hashed });
    return this.repo.save(user);
  }
}