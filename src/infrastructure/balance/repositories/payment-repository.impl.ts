import { Injectable } from '@nestjs/common';
import { Payment } from '../../../domain/balance/entities/payment';
import { PaymentRepository } from '../../../domain/balance/repositories/payment.repositoy';

@Injectable()
export class PaymentRepositoryImpl implements PaymentRepository {
  private payments: Payment[] = [];

  async save(payment: Payment): Promise<Payment> {
    const existingPaymentIndex = this.payments.findIndex(p => p.id === payment.id);
    if (existingPaymentIndex >= 0) {
      this.payments[existingPaymentIndex] = payment;
    } else {
      this.payments.push(payment);
    }
    return payment;
  }

  async findById(id: number): Promise<Payment | null> {
    const payment = this.payments.find(p => p.id === id);
    return payment || null;
  }

  async findByUserId(userId: number): Promise<Payment[]> {
    return this.payments.filter(p => p.userId === userId);
  }
}
