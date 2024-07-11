import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class BalanceService {
  constructor(private userRepository: UserRepository) {}

  async chargeBalance(userId: string, amount: number): Promise<number> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    user.balance += amount;
    await this.userRepository.save(user);
    return user.balance;
  }

  async getBalance(userId: string): Promise<number> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user.balance;
  }
}
