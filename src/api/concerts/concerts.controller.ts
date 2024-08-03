import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ReservationUseCase } from '../../application/concerts/use-cases/reservation.use-case';
import { AuthGuard } from '@nestjs/passport';

@Controller('concerts')
export class ConcertsController {
  constructor(private readonly reservationUseCase: ReservationUseCase) {
  }

  @Get('dates')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '예약 가능한 날짜 확인' })
  @ApiResponse({ status: 200, description: '예약 가능한 날짜 목록을 반환합니다.' })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청' })
  async getAvailableDates() {
    return this.reservationUseCase.getAvailableDates();
  }

  @Get('dates/:date/seats')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '예약 가능한 자리 조회' })
  @ApiResponse({ status: 200, description: '예약 가능한 좌석 목록을 반환합니다.', type: [Number] })
  @ApiResponse({ status: 400, description: '잘못된 날짜 형식' })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청' })
  @ApiParam({ name: 'date', type: String, description: '조회할 날짜 (YYYY-MM-DD 형식)' })
  async getAvailableSeats(@Param('date') date: string) {
    return this.reservationUseCase.getAvailableSeats(date);
  }
}
