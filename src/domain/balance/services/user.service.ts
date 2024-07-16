import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../entities/user';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findById(id: number): Promise<User> | null{
    return this.userRepository.findById(id);
  }
  //있으면 그 정보 가져옴,
  async createUser(user: User): Promise<User>{
    return this.userRepository.save(user)
  }

}
