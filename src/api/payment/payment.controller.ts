import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RefundPaymentUseCase } from '../../application/balance/use-cases/refund-payment-use-case.service';
import { PaymentResponseDto, ProcessPaymentDto } from './dto/payment.dto';
import { RefundRequestDto } from './dto/refund-request.dto';
import { RefundResponseDto } from './dto/refund-response.dto';
import { ReserveAndPayUseCase } from '../../application/concerts/use-cases/reserve-and-pay.usecase';

@ApiTags('Payment')
@Controller('payment')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class PaymentController {
  constructor(
    private refundPaymentUseCase: RefundPaymentUseCase,
    private reserveAndPayUseCase: ReserveAndPayUseCase,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '결제 처리' })
  @ApiResponse({ status: 200, type: PaymentResponseDto, description: '결제가 성공적으로 처리되었습니다.' })
  @ApiResponse({ status: 400, description: '잘못된 요청 - 잘못된 입력' })
  @ApiResponse({ status: 404, description: '찾을 수 없음 - 사용자 또는 예약을 찾을 수 없음' })
  @ApiResponse({ status: 402, description: '결제 필요 - 잔액 부족' })
  async processPayment(@Body()  processPaymentDto:ProcessPaymentDto): Promise<PaymentResponseDto> {
    return this.reserveAndPayUseCase.reserveAndPay(processPaymentDto);
  }

  @Post('refunds')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '환불 처리' })
  @ApiResponse({ status: 200, type: RefundResponseDto, description: '환불이 성공적으로 처리되었습니다.' })
  @ApiResponse({ status: 400, description: '잘못된 요청 - 잘못된 입력' })
  @ApiResponse({ status: 404, description: '찾을 수 없음 - 트랜잭션을 찾을 수 없음' })
  @ApiBody({ type: RefundRequestDto })
  processRefund(@Body() refundRequestDto: RefundRequestDto): Promise<RefundResponseDto> {
    // 환불 처리 로직
    return this.refundPaymentUseCase.processRefund(refundRequestDto);
  }
}
