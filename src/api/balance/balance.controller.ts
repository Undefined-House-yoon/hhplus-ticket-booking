import { Controller, Post, Get, Body, UseGuards, Inject, UseFilters, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiQuery, ApiParam } from '@nestjs/swagger';

import { AuthGuard } from '@nestjs/passport';
import { BalanceUseCase } from '../../application/balance/use-cases/balance.use-case';
import { BalanceResponseDto, ChargeBalanceDto, } from './dto/balance.dto';
import { CombinedExceptionFilter } from '../middlewares/filter/exception.filter';

@ApiTags('Balance')
@Controller('balance')
export class BalanceController {
  constructor(@Inject(BalanceUseCase)private readonly balanceUseCase: BalanceUseCase) {}

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '잔액 조회' })
  @ApiResponse({ status: 200, type: BalanceResponseDto, description: '잔액이 성공적으로 조회되었습니다.' })
  @ApiResponse({ status: 400, description: '잘못된 요청 - 유효하지 않은 입력' })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없습니다.' })
  @ApiParam({ name: 'userId', type: String, description: '사용자 ID' })
  getBalance(@Param('id') userId: number): Promise<BalanceResponseDto> {
    return this.balanceUseCase.getBalance(userId);
  }


  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '잔액 충전' })
  @ApiResponse({ status: 200, type: BalanceResponseDto, description: '잔액이 성공적으로 충전되었습니다.' })
  @ApiResponse({ status: 400, description: '잘못된 요청 - 유효하지 않은 입력' })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없습니다.' })
  @ApiBody({ type: BalanceResponseDto })
  chargeBalance(@Body() chargeBalanceDto: ChargeBalanceDto): Promise<BalanceResponseDto> {
    return this.balanceUseCase.chargeBalance(chargeBalanceDto);
  }
}


// @RequiredArgsConstructor
// @Repository
// public class QueueTokenRepositoryImpl implements QueueTokenRepository {
//   private final QueueTokenJpaRepository queueTokenJpaRepository;
// ...
// }
// [tobe]
// @RequiredArgsConstructor
// @Repository
// public class QueueTokenRepositoryImpl implements QueueTokenRepository {
//   private final QueueTokenJpaRepository queueTokenJpaRepository;
//   private final QueueTokenRedisRepository queueTokenRedisRepository;
// ...
// }
