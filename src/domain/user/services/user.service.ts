import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../entites/user';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findById(id: number): Promise<User> | null{
    const user = await this.userRepository.findById(id);
    if(user) return user;
    throw Error('User not found');
  }
  //있으면 그 정보 가져옴,
  async createUser(user: User): Promise<User>{
    return this.userRepository.save(user)
  }

}
