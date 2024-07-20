import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Reservation, ReservationStatus } from '../entities/reservation';
import { ReservationRepository } from '../repositories/reservation.repository';
import { CreateReservationDto } from '../../../api/concerts/dto/create-reservation-date.dto';

@Injectable()
export class ReservationService {
  constructor(private reservationRepository: ReservationRepository) {}

  async getAvailableDates(): Promise<Date[]> {
    return this.reservationRepository.findAvailableDates();
  }

  async getAvailableSeats(date: Date): Promise<number[]> {
    const concertDetailId = await this.reservationRepository.findConcertDetailIdByDate(date);
    if (!concertDetailId) {
      throw new NotFoundException('No concert found for the given date');
    }
    return this.reservationRepository.findAvailableSeats(concertDetailId);
  }

  async createReservation(createReservationDto: CreateReservationDto): Promise<Reservation> {
    const concertDetailId = await this.reservationRepository.findConcertDetailIdByDate(new Date(createReservationDto.date));
    if (!concertDetailId) {
      throw new NotFoundException('No concert found for the given date');
    }

    const availableSeats = await this.reservationRepository.findAvailableSeats(concertDetailId);
    if (!availableSeats.includes(createReservationDto.seatNumber)) {
      throw new BadRequestException('Selected seat is not available');
    }

    const reservation = Reservation.create({
      id: 0,
      userId: createReservationDto.userId,
      seatNumber: createReservationDto.seatNumber,
      concertDate: new Date(createReservationDto.date),
      status: ReservationStatus.PENDING,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes expiration
      seatId: createReservationDto.seatNumber, // Assuming seatId is the same as seatNumber
      concertDetailId: concertDetailId
    });
//SeatStatus.RESERVED
    const savedReservation = await this.reservationRepository.save(reservation);
    await this.reservationRepository.updateSeatStatus(savedReservation.seatId, 'RESERVED');

    return savedReservation;
  }

  async cancelReservation(reservationId: number): Promise<Reservation> {
    const reservation = await this.reservationRepository.findById(reservationId);
    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    if (!reservation.canBeConfirmed()) {
      throw new BadRequestException('Reservation cannot be cancelled');
    }

    const cancelledReservation = await this.reservationRepository.cancelReservation(reservationId);
    // SeatStatus.AVAILABLE
    await this.reservationRepository.updateSeatStatus(cancelledReservation.seatId, 'AVAILABLE');

    return cancelledReservation;
  }

  async getUserReservations(userId: number): Promise<Reservation[]> {
    return this.reservationRepository.findByUserId(userId);
  }

  async getReservationDetails(reservationId: number): Promise<Reservation> {
    const reservation = await this.reservationRepository.findById(reservationId);
    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }
    return reservation;
  }
}
