import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ConcertDetail } from '../../domain/concerts/entities/concert-detail';
import { Seat } from '../../domain/concerts/entities/seat';
import {
  GetAllUpcomingConcertsByDateUseCase,
} from 'src/application/concerts/use-cases/get-all-upcoming-concerts-by-date.use-case';
import { GetAvailableSeatsUseCase } from '../../application/concerts/use-cases/get-available-seats.use-case';
import { CacheKey, CacheTTL } from '@nestjs/common/cache';

@Controller('dates')
export class ConcertsController {
  constructor(
    private readonly getAllUpcomingConcertsByDateUseCase: GetAllUpcomingConcertsByDateUseCase,
    private readonly getAvailableSeatsUseCase: GetAvailableSeatsUseCase,
  ) {
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '예약 가능한 날짜 확인' })
  @ApiResponse({ status: 200, description: '예약 가능한 날짜 목록을 반환합니다.' })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청' })
  @CacheKey('available-dates')
  @CacheTTL(3600) // 캐시 유효 시간 1시간
  async getAvailableDates(): Promise<ConcertDetail[]> {
    return this.getAllUpcomingConcertsByDateUseCase.getAllUpcomingConcertsByDate();
  }

  @Get(':concertDetailId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '예약 가능한 자리 조회' })
  @ApiResponse({ status: 200, description: '예약 가능한 좌석 목록을 반환합니다.', type: [Number] })
  @ApiResponse({ status: 400, description: '잘못된 날짜 형식' })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청' })
  @CacheKey('available-seats')
  @CacheTTL(3600) // 캐시 유효 시간 1시간
  @ApiParam({ name: 'date', type: String, description: '조회할 날짜 (YYYY-MM-DD 형식)' })
  async getAvailableSeats(@Param('concertDetailId') concertDetailId: number): Promise<Seat[]> {
    return this.getAvailableSeatsUseCase.getAvailableSeats(concertDetailId);
  }
}
