import { Injectable } from '@nestjs/common';
import { BalanceService } from '../../../domain/balance/services/balance.service';
import { BalanceResponseDto, ChargeBalanceDto } from '../../../api/balance/dto/balance.dto';

@Injectable()
export class BalanceUseCase {
  constructor(private balanceService: BalanceService) {
  }

  async chargeBalance(chargeBalanceDto: ChargeBalanceDto): Promise<BalanceResponseDto> {
    const newBalance = await this.balanceService.chargeBalance(chargeBalanceDto.userId, chargeBalanceDto.amount);
    let balance = new BalanceResponseDto();
    balance.balance = newBalance;
    return balance;
  }

  async getBalance(userId: number): Promise<BalanceResponseDto> {
    const balance = await this.balanceService.getBalance(userId);
    let currentBalance = new BalanceResponseDto();
    currentBalance.balance = balance;
    return currentBalance;
  }
}
