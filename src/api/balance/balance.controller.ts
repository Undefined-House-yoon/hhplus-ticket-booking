import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { AuthGuard } from '@nestjs/passport';
import { BalanceUseCase } from '../../application/balance/use-cases/balance.use-case';
import { BalanceResponseDto, ChargeBalanceDto, GetBalanceDto } from './dto/balance.dto';

@ApiTags('Balance')
@Controller('balance')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class BalanceController {
  constructor(private balanceUseCase: BalanceUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Charge balance' })
  @ApiResponse({ status: 200, type: BalanceResponseDto })
  async chargeBalance(@Body() body: ChargeBalanceDto): Promise<BalanceResponseDto> {
    return this.balanceUseCase.chargeBalance(body.userId, body.amount);
  }

  @Get()
  @ApiOperation({ summary: 'Get balance' })
  @ApiResponse({ status: 200, type: BalanceResponseDto })
  async getBalance(@Body() body: GetBalanceDto): Promise<BalanceResponseDto> {
    return this.balanceUseCase.getBalance(body.userId);
  }
}
