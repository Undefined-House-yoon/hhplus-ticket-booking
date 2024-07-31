import { Injectable } from '@nestjs/common';
import { Payment } from '../../../domain/balance/entities/payment';
import { PaymentRepository } from '../../../domain/balance/repositories/payment.repositoy';
import { PrismaService } from '../../../../prisma/prisma.service';
import { PaymentMapper } from '../mapper/payment.mapper';


@Injectable()
export class PaymentRepositoryImpl implements PaymentRepository {
  constructor(private prisma: PrismaService) {
  }
  /**
   * 결제 데이터를 저장합니다. 결제 ID가 존재하면 업데이트하고, 존재하지 않으면 새로 생성합니다.
   * @param payment 저장할 Payment 객체
   * @returns 저장된 Payment 객체
   */
  async save(payment: Payment): Promise<Payment> {
    const prismaData = await this.prisma.payment.upsert({
      where: { id: payment.id || 0 },
      update: {
        amount: payment.amount,
        status: payment.status,
      },
      create: {
        reservation_id: payment.reservationId,
        amount: payment.amount,
        status: payment.status,
      },
    });
    return PaymentMapper.toDomain(prismaData);
  }
  /**
   * 주어진 ID로 결제를 찾습니다.
   * @param id 결제 ID
   * @returns 결제를 찾으면 Payment 객체, 찾지 못하면 null
   */
  async findById(id: number): Promise<Payment | null> {
    const payment = await this.prisma.payment.findUnique({ where: { id } });
    return payment ? PaymentMapper.toDomain(payment) : null;
  }
  /**
   * 주어진 예약 ID로 결제를 찾습니다.
   * @param reservationId 예약 ID
   * @returns 결제를 찾으면 Payment 객체, 찾지 못하면 null
   */
  async findByReservationId(reservationId: number): Promise<Payment | null> {
    const payment = await this.prisma.payment.findUnique({ where: { reservation_id: reservationId } });
    return payment ? PaymentMapper.toDomain(payment) : null;
  }
  /**
   * 주어진 사용자 ID로 모든 결제를 찾습니다.
   * @param userId 사용자 ID
   * @returns Payment 객체 배열
   */
  async findByUserId(userId: number): Promise<Payment[]> {
    const payments = await this.prisma.payment.findMany({ where: { reservation: { user_id: userId } } });
    return payments.map((value, index) => PaymentMapper.toDomain(value));
  }

}








