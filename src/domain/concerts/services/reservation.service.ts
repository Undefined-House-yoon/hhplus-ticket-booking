import { Injectable, NotFoundException } from '@nestjs/common';
import { Reservation, ReservationStatus } from '../entities/reservation';
import { ReservationRepository } from '../repositories/reservation.repository';
import { CreateReservationDto } from '../../../api/concerts/dto/create-reservation-date.dto';

// export enum ReservationStatus {
//   PENDING = 'PENDING',
//   CONFIRMED = 'CONFIRMED',
//   CANCELLED = 'CANCELLED',
//   EXPIRED = 'EXPIRED',
// }

@Injectable()
export class ReservationService {
  constructor(private reservationRepository: ReservationRepository) {
  }
  /*유저 예약정보 가져오기*/
  async getUserReservations(userId: number): Promise<Reservation[]> {
    return this.reservationRepository.findByUserId(userId);
  }

  /*예약 정보 확인하기*/
  async getReservationDetails(reservationId: number): Promise<Reservation> {
    const reservation = await this.reservationRepository.findById(reservationId);
    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }
    return reservation;
  }
  /*예약 생성*/
  async createReservation(createReservationDto: CreateReservationDto): Promise<Reservation> {

    const reservation = Reservation.create({
      userId: createReservationDto.userId,
      seatNumber: createReservationDto.seatNumber,
      concertDate: new Date(createReservationDto.date),
      status: ReservationStatus.PENDING,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes expiration
      seatId: createReservationDto.seatNumber, // Assuming seatId is the same as seatNumber
      concertDetailId: createReservationDto.concertsDetailId,
    });

    return this.reservationRepository.save(reservation);
  }

  /*예약 완료*/
  async confirmReservation(reservationId: number): Promise<Reservation> {
      return this.reservationRepository.updateReservation(reservationId)
  }

  /*예약취소*/
  async cancelReservation(reservationId: number): Promise<Reservation> {
     return this.reservationRepository.cancelReservation(reservationId);
  }

  /*예약 만료 벌크*/
  async expireReservation(): Promise<void>{
    const reservations =await this.reservationRepository.findActiveReservations();
    const expireReservations = reservations.map((reservation: Reservation) =>{
      if(reservation.isExpired()){
        reservation.expire()
      }
      return reservation
    });
    await this.reservationRepository.updateReservationStatus(expireReservations)
  }


}
