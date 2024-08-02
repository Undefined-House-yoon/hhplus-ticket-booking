import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../user/repositories/user.repository';
import { ReservationRepository } from '../../concerts/repositories/reservation.repository';
import { Payment, PaymentStatus } from '../entities/payment';
import { PaymentRepository } from '../repositories/payment.repositoy';
import { ProcessPaymentDto } from '../../../api/balance/dto/payment.dto';
import { RefundRequestDto } from '../../../api/balance/dto/refund-request.dto';
import { RefundResponseDto } from '../../../api/balance/dto/refund-response.dto';
import { ReservationStatus } from '../../concerts/entities/reservation';

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

    user.withdraw(processPaymentDto.amount);
    await this.userRepository.save(user);

    const payment = Payment.createPayment(
      {
        userId:processPaymentDto.userId,
        reservationId:processPaymentDto.reservationId,
        amount:processPaymentDto.amount,
        status:PaymentStatus.Success,
      },
    );
    await this.paymentRepository.save(payment);

    reservation.confirm();
    await this.reservationRepository.save(reservation);

    return payment;
  }
async processRefund(processRefund:RefundRequestDto): Promise<RefundResponseDto>{
    //예약정보 확인하고 본인 확인하고 지금날짜 확인하고 공연날짜 확인하고 문제 없으면 유저 잔액 price만큼 증액
    const {reservationId, userId} = processRefund
    // 예약 정보 확인
    const reservation = await this.reservationRepository.findById(reservationId);
    if (!reservation) {
      throw new Error('Reservation not found');
    }

    // 사용자 확인
    const user = await this.userRepository.findById(reservation.userId);
    if (!user && userId === user.id) {
      throw new Error('User not found');
    }

    // 현재 날짜와 공연 날짜 확인
    const currentDate = new Date();
    if (currentDate >= reservation.concertDate) {
      throw new Error('Cannot refund after the concert date');
    }

    // 결제 정보 확인
    const payment = await this.paymentRepository.findByReservationId(reservationId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    // 예약 상태 업데이트
    await this.reservationRepository.cancelReservation(reservationId);
    user.deposit(payment.amount)
    await this.userRepository.save(user)
    const response = new RefundResponseDto();
    response.balance = user.balance
    response.user = user
    return response;
  }
}
