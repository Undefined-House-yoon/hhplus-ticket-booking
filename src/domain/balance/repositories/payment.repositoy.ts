import { Payment } from '../entities/payment';

export abstract class PaymentRepository {
  abstract save(payment: Payment): Promise<Payment>;
  abstract findById(id: number): Promise<Payment | null>;
  abstract findByUserId(userId: number): Promise<Payment[]>;
  abstract findByReservationId(userId: number): Promise<Payment>;
}
