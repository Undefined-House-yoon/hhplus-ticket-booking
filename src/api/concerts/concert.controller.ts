import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateReservationDto } from './dto/create-reservation-date.dto';
import { ReservationUseCase } from '../../application/concerts/use-cases/reservation.use-case';


@ApiTags('Reservations')
@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationUseCase: ReservationUseCase) {}

  @Get('dates')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '예약 가능한 날짜 확인' })
  @ApiResponse({ status: 200, description: '예약 가능한 날짜 목록을 반환합니다.' })
  async getAvailableDates() {
    return this.reservationUseCase.getAvailableDates();
  }

  @Get('dates/:date/seats')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '예약 가능한 자리 조회' })
  @ApiResponse({ status: 200, description: '예약 가능한 좌석 목록을 반환합니다.' })
  async getAvailableSeats(@Param('date') date: string) {
    return this.reservationUseCase.getAvailableSeats(date);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '예약 만들기' })
  @ApiResponse({ status: 201, description: '예약이 성공적으로 생성되었습니다' })
  async createReservation(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationUseCase.createReservation(createReservationDto);
  }
}


