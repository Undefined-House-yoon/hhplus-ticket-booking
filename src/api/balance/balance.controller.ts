import { Controller, Post, Get, Body, UseGuards, Inject, UseFilters, Query, Param, ParseIntPipe } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiBadRequestResponse, ApiNotFoundResponse,
} from '@nestjs/swagger';

import { AuthGuard } from '@nestjs/passport';
import { BalanceUseCase } from '../../application/balance/use-cases/balance.use-case';
import { BalanceResponseDto, ChargeBalanceDto, } from './dto/balance.dto';
import { CombinedExceptionFilter } from '../middlewares/filter/exception.filter';
import { ChargeBalanceUseCase } from '../../application/balance/use-cases/charge-balance.use-case';
import { GetBalanceUseCase } from '../../application/balance/use-cases/get-balance.use-case';

@ApiTags('Balance')
@Controller('balance')
export class BalanceController {
  constructor(
    @Inject(ChargeBalanceUseCase)private readonly chargeBalanceUseCase: ChargeBalanceUseCase,
    @Inject(GetBalanceUseCase)private readonly getBalanceUseCase: GetBalanceUseCase,
  ) {}

  @Get(':id')
  // @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '잔액 조회' })
  @ApiParam({ name: 'id', type: String, description: '사용자 ID' })
  @ApiResponse({ status: 200, type: BalanceResponseDto, description: '잔액이 성공적으로 조회되었습니다.' })
  @ApiBadRequestResponse({ description: '잘못된 요청 - 유효하지 않은 입력' })
  @ApiNotFoundResponse({ description: '사용자를 찾을 수 없습니다.' })
  getBalance(@Param('id',ParseIntPipe) userId: number): Promise<BalanceResponseDto> {
    return this.getBalanceUseCase.execute(userId);
  }


  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '잔액 충전' })
  @ApiBody({ type: ChargeBalanceDto })
  @ApiResponse({ status: 200, type: BalanceResponseDto, description: '잔액이 성공적으로 충전되었습니다.' })
  @ApiBadRequestResponse({ description: '잘못된 요청 - 유효하지 않은 입력' })
  @ApiNotFoundResponse({ description: '사용자를 찾을 수 없습니다.' })
  chargeBalance(@Body() chargeBalanceDto: ChargeBalanceDto): Promise<BalanceResponseDto> {
    return this.chargeBalanceUseCase.execute(chargeBalanceDto);
  }
}
