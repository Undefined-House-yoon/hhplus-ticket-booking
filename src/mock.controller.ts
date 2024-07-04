import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MockAuthGuard } from './mock-auth.guard';

@Controller()
export class ConcertController {
  /**
   * 유저 토큰 발급 API
   * @route POST /token
   * @param {string} userId - 유저 ID
   * @returns {Object} token과 대기열 정보
   */
  @Post('token')
  async issueToken(@Body() body: { userId: string }) {
    return {
      token: 'mock_jwt_token',
      queueInfo: {
        position: Math.floor(Math.random() * 100),
        waitTime: '5m'
      }
    };
  }

  /**
   * 예약 가능 날짜 조회 API
   * @route GET /dates
   * @returns {Object} 예약 가능한 날짜 목록
   */
  @UseGuards(MockAuthGuard)
  @Get('dates')
  async getAvailableDates() {
    return {
      dates: ['2024-07-01', '2024-07-02', '2024-07-03']
    };
  }

  @Get('dates/:date/seats')
  async getAvailableSeats(@Param('date') date: string) {
    return {
      seats: Array.from({length: 50}, (_, i) => i + 1)
    };
  }

  /**
   * 좌석 예약 요청 API
   * @route POST /reservations
   * @param {string} date - 예약 날짜
   * @param {number} seatNumber - 좌석 번호
   * @param {string} token - 유저 토큰
   * @returns {Object} 예약 ID와 만료 시간
   */
  @UseGuards(MockAuthGuard)
  @Post('reservations')
  async createReservation(@Body() body: { date: string, seatNumber: number, token: string }) {
    return {
      reservationId: 'mock_reservation_id',
      expiresIn: '5m'
    };
  }

  /**
   * 잔액 충전 API
   * @route POST /balance
   * @param {string} userId - 유저 ID
   * @param {number} amount - 충전할 금액
   * @returns {Object} 충전 후 잔액
   */
  @UseGuards(MockAuthGuard)
  @Post('balance')
  async chargeBalance(@Body() body: { userId: string, amount: number }) {
    return {
      balance: 20000
    };
  }

  /**
   * 잔액 조회 API
   * @route GET /balance
   * @param {string} userId - 유저 ID
   * @returns {Object} 현재 잔액
   */
  @UseGuards(MockAuthGuard)
  @Get('balance')
  async getBalance(@Query('userId') userId: string) {
    return {
      balance: 20000
    };
  }

  /**
   * 결제 API
   * @route POST /payment
   * @param {string} reservationId - 예약 ID
   * @param {string} userId - 유저 ID
   * @param {number} amount - 결제 금액
   * @returns {Object} 결제 상태와 트랜잭션 ID
   */
  @UseGuards(MockAuthGuard)
  @Post('payment')
  async processPayment(@Body() body: { reservationId: string, userId: string, amount: number }) {
    return {
      status: 'success',
      transactionId: 'mock_transaction_id'
    };
  }
}
