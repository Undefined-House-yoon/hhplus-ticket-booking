import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../user/repositories/user.repository';

@Injectable()
export class BalanceService {
  constructor(private userRepository: UserRepository) {}

  async chargeBalance(userId: number, amount: number): Promise<number> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (amount < 0 && Math.abs(amount) > user.balance) {
      throw new Error('Invalid amount');
    }

    user.balance += amount;

    await this.userRepository.save(user);
    return user.balance;
  }

  async getBalance(userId: number): Promise<number> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user.balance;
  }
}
