import { Injectable } from '@nestjs/common';
import { BalanceService } from '../../../domain/balance/services/balance.service';
import { BalanceResponseDto } from '../../../api/balance/dto/balance.dto';

@Injectable()
export class GetBalanceUseCase {
  constructor(private balanceService: BalanceService) {}

  async execute(userId: number): Promise<BalanceResponseDto> {
    const balance = await this.balanceService.getBalance(userId);
    let currentBalance = new BalanceResponseDto();
    currentBalance.balance = balance;
    return currentBalance;
  }
}
