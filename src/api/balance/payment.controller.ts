import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PaymentUseCase } from '../../application/balance/use-cases/payment.use-case';
import { PaymentResponseDto, ProcessPaymentDto } from './dto/payment.dto';

@ApiTags('Payment')
@Controller('payment')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class PaymentController {
  constructor(private paymentUseCase: PaymentUseCase) {}

  @Post()
  @ApiOperation({ summary: '결제 처리' })
  @ApiResponse({ status: 200, type: PaymentResponseDto, description: '결제가 성공적으로 처리되었습니다.' })
  @ApiResponse({ status: 400, description: '잘못된 요청 - 잘못된 입력' })
  @ApiResponse({ status: 404, description: '찾을 수 없음 - 사용자 또는 예약을 찾을 수 없음' })
  @ApiResponse({ status: 402, description: '결제 필요 - 잔액 부족' })
  async processPayment(@Body()  processPaymentDto:ProcessPaymentDto): Promise<PaymentResponseDto> {
    return this.paymentUseCase.processPayment(processPaymentDto);
  }
}
