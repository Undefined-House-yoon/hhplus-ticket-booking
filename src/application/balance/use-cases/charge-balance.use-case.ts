import { Injectable } from '@nestjs/common';
import { BalanceService } from '../../../domain/balance/services/balance.service';
import { BalanceResponseDto, ChargeBalanceDto } from '../../../api/balance/dto/balance.dto';

@Injectable()
export class ChargeBalanceUseCase {
  constructor(private balanceService: BalanceService) {}

  async execute(chargeBalanceDto: ChargeBalanceDto): Promise<BalanceResponseDto> {
    const newBalance = await this.balanceService.chargeBalance(chargeBalanceDto.userId, chargeBalanceDto.amount);
    let balance = new BalanceResponseDto();
    balance.balance = newBalance;
    return balance;
  }
}
