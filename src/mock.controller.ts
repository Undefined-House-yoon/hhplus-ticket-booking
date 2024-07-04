import { Controller, Post, Get, Body, Param, Query, } from '@nestjs/common';

@Controller("/")
export class ConcertController {
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

  @Post('reservations')
  async createReservation(@Body() body: { date: string, seatNumber: number, token: string }) {
    return {
      reservationId: 'mock_reservation_id',
      expiresIn: '5m'
    };
  }

  @Post('balance')
  async chargeBalance(@Body() body: { userId: string, amount: number }) {
    return {
      balance: 20000
    };
  }

  @Get('balance')
  async getBalance(@Query('userId') userId: string) {
    return {
      balance: 20000
    };
  }

  @Post('payment')
  async processPayment(@Body() body: { reservationId: string, userId: string, amount: number }) {
    return {
      status: 'success',
      transactionId: 'mock_transaction_id'
    };
  }
}
