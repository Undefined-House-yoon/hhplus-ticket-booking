import { Injectable } from '@nestjs/common';
import { PaymentService } from '../../../domain/balance/services/payment.service';
import { PaymentResponseDto, ProcessPaymentDto } from '../../../api/balance/dto/payment.dto';

@Injectable()
export class PaymentUseCase {
  constructor(private paymentService: PaymentService) {}

  async processPayment(processPaymentDto:ProcessPaymentDto): Promise<PaymentResponseDto> {
    const payment = await this.paymentService.processPayment(processPaymentDto);
    let paymentResponseDto = new PaymentResponseDto();
    paymentResponseDto.status = payment.status;
    paymentResponseDto.transactionId = payment.id;
    return paymentResponseDto;
  }
}
