import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { ReservationRepository } from '../../concerts/repositories/reservation.repository';
import { Payment } from '../entities/payment';
import { PaymentRepository } from '../repositories/payment.repositoy';
import { ProcessPaymentDto } from '../../../api/balance/dto/payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    private userRepository: UserRepository,
    private paymentRepository: PaymentRepository,
    private reservationRepository: ReservationRepository
  ) {}

  async processPayment(processPaymentDto:ProcessPaymentDto): Promise<Payment> {
    const user = await this.userRepository.findById(processPaymentDto.userId);
    if (!user) {
      throw new Error('User not found');
    }
    if (user.balance < processPaymentDto.amount) {
      throw new Error('Insufficient balance');
    }

    const reservation = await this.reservationRepository.findById(processPaymentDto.reservationId);
    if (!reservation) {
      throw new Error('Reservation not found');
    }

    user.balance -= processPaymentDto.amount;
    await this.userRepository.save(user);

    const payment = new Payment(
      Date.now(),
      processPaymentDto.userId,
      processPaymentDto.reservationId,
      processPaymentDto.amount,
      'success'
    );
    await this.paymentRepository.save(payment);

    reservation.isPaid = true;
    await this.reservationRepository.save(reservation);

    return payment;
  }
}
