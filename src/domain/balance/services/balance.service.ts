import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../user/repositories/user.repository';
import { ErrorHandler } from '../../../exceptions/exception';

@Injectable()
export class BalanceService {
  constructor(private userRepository: UserRepository) {}

  async chargeBalance(userId: number, amount: number): Promise<number> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw ErrorHandler.notFound('User not found',{ cause: 'User does not exist in the database' });
    }

    if (amount < 0 && Math.abs(amount) > user.balance) {
      throw ErrorHandler.badRequest('Invalid amount',{ cause: 'Insufficient balance' });
    }

    user.deposit(amount);

    await this.userRepository.save(user);
    return user.balance;
  }

  async getBalance(userId: number): Promise<number> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw ErrorHandler.notFound('user not found',{ cause: 'User does not exist in the database' });
    }
    return user.balance;
  }
}
