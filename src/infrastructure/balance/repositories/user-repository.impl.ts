import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../domain/balance/repositories/user.repository';
import { User } from '../../../domain/balance/entities/user';


@Injectable()
export class UserRepositoryImpl implements UserRepository {
  private users: User[] = [];

  async findById(id: number): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }

  async save(user: User): Promise<User> {
    const index = this.users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      this.users[index] = user;
    } else {
      this.users.push(user);
    }
    return user;
  }
}
