import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../domain/balance/repositories/user.repository';
import { User } from '../../../domain/balance/entities/user';


@Injectable()
export class UserRepositoryImpl implements UserRepository {
  private static users: User[] = [];

  async findById(id: number): Promise<User | null> {
    return UserRepositoryImpl.users.find(user => user.id === id) || null;
  }

  /**
   * @param {User}user The user
   * user 가 있으면 수정 해주고
   * 없으면 생성합니다.
   * */
  async save(user: User): Promise<User> {
    const index = UserRepositoryImpl.users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      UserRepositoryImpl.users[index] = user;
    } else {
      UserRepositoryImpl.users.push(user);
    }
    return user;
  }
}
