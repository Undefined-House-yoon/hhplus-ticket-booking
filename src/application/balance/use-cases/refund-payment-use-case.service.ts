import { Injectable } from '@nestjs/common';
import { PaymentService } from '../../../domain/balance/services/payment.service';
import { RefundRequestDto } from '../../../api/balance/dto/refund-request.dto';
import { RefundResponseDto } from '../../../api/balance/dto/refund-response.dto';

@Injectable()
export class RefundPaymentUseCase {
  constructor(private paymentService: PaymentService) {}


/*환불 처리*/
  async processRefund(processRefund:RefundRequestDto): Promise<RefundResponseDto> {
    return this.paymentService.processRefund(processRefund);
  }
}
