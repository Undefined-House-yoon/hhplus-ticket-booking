import { Controller, Post, Get, Body, Param, Query, UseGuards, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

interface TokenResponse {
  token: string;
  queueInfo: {
    position: number;
    waitTime: string;
  };
}

interface DatesResponse {
  dates: string[];
}

interface SeatsResponse {
  seats: number[];
}

interface ReservationResponse {
  reservationId: string;
  expiresIn: string;
}

interface BalanceResponse {
  balance: number;
}

interface PaymentResponse {
  status: string;
  transactionId: string;
}

interface ReservationDetailResponse {
  reservationId: string;
  userId: string;
  date: string;
  seatNumber: number;
  status: string;
  createdAt: string;
  expiresAt: string;
}

interface RefundResponse {
  refundId: string;
  amount: number;
  status: string;
}

interface SeatDetailResponse {
  seatId: number;
  seatNumber: number;
  status: string;
  price: number;
}
@Controller('api')
export class ApiController {

  // 유저 토큰 발급 API
  @Post('token')
  issueToken(@Body('userId') userId: string): Promise<TokenResponse> {
    // 토큰 발급 로직
    return;
  }

  // 예약 가능 날짜 API
  @UseGuards(AuthGuard('jwt'))
  @Get('dates')
  getAvailableDates(): Promise<DatesResponse> {
    // 예약 가능 날짜 조회 로직
    return;
  }

  // 예약 가능 좌석 API
  @UseGuards(AuthGuard('jwt'))
  @Get('dates/:date/seats')
  getAvailableSeats(@Param('date') date: string): Promise<SeatsResponse> {
    // 예약 가능 좌석 조회 로직
    return;
  }

  // 좌석 예약 요청 API
  @UseGuards(AuthGuard('jwt'))
  @Post('reservations')
  createReservation(
    @Body('date') date: string,
    @Body('seatNumber') seatNumber: number,
    @Body('token') token: string
  ): Promise<ReservationResponse> {
    // 좌석 예약 로직
    return;
  }

  // 예약 상세 정보 조회 API
  @UseGuards(AuthGuard('jwt'))
  @Get('reservations/:id')
  getReservationDetail(@Param('id') id: string): Promise<ReservationDetailResponse> {
    // 예약 상세 정보 조회 로직
    return;
  }

  // 예약 취소 API
  @UseGuards(AuthGuard('jwt'))
  @Delete('reservations/:id')
  cancelReservation(@Param('id') id: string): Promise<{ status: string }> {
    // 예약 취소 로직
    return;
  }

  // 잔액 충전 API
  @UseGuards(AuthGuard('jwt'))
  @Post('balance')
  chargeBalance(
    @Body('userId') userId: string,
    @Body('amount') amount: number
  ): Promise<BalanceResponse> {
    // 잔액 충전 로직
    return;
  }

  // 잔액 조회 API
  @UseGuards(AuthGuard('jwt'))
  @Get('balance')
  getBalance(@Query('userId') userId: string): Promise<BalanceResponse> {
    // 잔액 조회 로직
    return;
  }

  // 결제 처리 API
  @UseGuards(AuthGuard('jwt'))
  @Post('payment')
  processPayment(
    @Body('reservationId') reservationId: string,
    @Body('userId') userId: string,
    @Body('amount') amount: number
  ): Promise<PaymentResponse> {
    // 결제 처리 로직
    return;
  }

  // 환불 처리 API
  @UseGuards(AuthGuard('jwt'))
  @Post('refunds')
  processRefund(@Body('reservationId') reservationId: string): Promise<RefundResponse> {
    // 환불 처리 로직
    return;
  }

  // 좌석 정보 상세 조회 API
  @UseGuards(AuthGuard('jwt'))
  @Get('seats/:id')
  getSeatDetail(@Param('id') id: number): Promise<SeatDetailResponse> {
    // 좌석 정보 상세 조회 로직
    return;
  }

  // 결제 내역 조회 API
  @UseGuards(AuthGuard('jwt'))
  @Get('payments')
  getPaymentHistory(
    @Query('userId') userId: string,
    @Query('page') page: number,
    @Query('limit') limit: number
  ): Promise<{ payments: PaymentResponse[], total: number }> {
    // 결제 내역 조회 로직
    return;
  }
}
