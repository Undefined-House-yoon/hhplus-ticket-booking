import { Injectable } from '@nestjs/common';
import { BalanceService } from '../../../domain/balance/services/balance.service';
import { BalanceResponseDto } from '../../../api/balance/dto/balance.dto';

@Injectable()
export class BalanceUseCase {
  constructor(private balanceService: BalanceService) {}

  async chargeBalance(userId: number, amount: number): Promise<BalanceResponseDto> {
    const newBalance = await this.balanceService.chargeBalance(userId, amount);
    let balance =  new BalanceResponseDto();
    balance.balance = newBalance;
    return balance;
  }

  async getBalance(userId: number): Promise<BalanceResponseDto> {
    const balance = await this.balanceService.getBalance(userId);
    let currentBalance =  new BalanceResponseDto();
    currentBalance.balance = balance;
    return currentBalance;
  }
}
