import { Injectable } from '@nestjs/common';
import { BalanceService } from '../../../domain/balance/services/balance.service';

@Injectable()
export class BalanceUseCase {
  constructor(private balanceService: BalanceService) {}

  async chargeBalance(userId: string, amount: number): Promise<{ balance: number }> {
    const newBalance = await this.balanceService.chargeBalance(userId, amount);
    return { balance: newBalance };
  }

  async getBalance(userId: string): Promise<{ balance: number }> {
    const balance = await this.balanceService.getBalance(userId);
    return { balance };
  }
}
