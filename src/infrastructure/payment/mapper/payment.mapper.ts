import { Payment } from '../../../domain/balance/entities/payment';



export class PaymentMapper {
  static toDomain(prismaPayment: any): Payment {
    return Payment.createPayment({
      id: prismaPayment.id,
      userId: prismaPayment.reservation.user_id, // assuming payment has a relation to reservation
      reservationId: prismaPayment.reservation_id, // assuming payment has a relation to reservation
      amount: prismaPayment.amount,
      status: prismaPayment.status,
      createdAt: prismaPayment.created_at
    });
  }

  static fromDomain(payment: Payment): any {
    return {
      id: payment.id,
      reservation_id: payment.reservationId,
      amount: payment.amount,
      status: payment.status,
      created_at: payment.createdAt
    };
  }
}

