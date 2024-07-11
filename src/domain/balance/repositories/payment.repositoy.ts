import { Payment } from '../entities/payment';

export interface PaymentRepository {
  save(payment: Payment): Promise<Payment>;
  findById(id: string): Promise<Payment | null>;
  findByUserId(userId: string): Promise<Payment[]>;
}
