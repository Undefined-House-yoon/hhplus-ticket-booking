import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PaymentUseCase } from '../../application/balance/use-cases/payment.use-case';
import { PaymentResponseDto, ProcessPaymentDto } from './dto/payment.dto';

@ApiTags('Payment')
@Controller('payment')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class PaymentController {
  constructor(private paymentUseCase: PaymentUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Process payment' })
  @ApiResponse({ status: 200, type: PaymentResponseDto, description: 'Payment processed successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input' })
  @ApiResponse({ status: 404, description: 'Not Found - User or Reservation not found' })
  @ApiResponse({ status: 402, description: 'Payment Required - Insufficient balance' })
  async processPayment(@Body()  processPaymentDto:ProcessPaymentDto) {
    return this.paymentUseCase.processPayment(processPaymentDto);
  }
}
