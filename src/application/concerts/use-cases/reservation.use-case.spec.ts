// import { Test, TestingModule } from '@nestjs/testing';
// import { ReservationUseCase } from './reservation.use-case';
// import { ReservationService } from '../../../domain/concerts/services/reservation.service';
// import { Reservation } from '../../../domain/concerts/entities/reservation';
// import { ReservationRepository } from '../../../domain/concerts/repositories/reservation.repository';
// import { CreateReservationDto } from '../../../api/concerts/dto/create-reservation-date.dto';
// import { ConcertModule } from '../../../api/concert.module';
//
// describe('ReservationUseCase', () => {
//   let useCase: ReservationUseCase;
//   let service: ReservationService;
//   let repository: ReservationRepository;
//
//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//      imports:[ConcertModule]
//     }).compile();
//
//     useCase = module.get<ReservationUseCase>(ReservationUseCase);
//     service = module.get<ReservationService>(ReservationService);
//     repository = module.get<ReservationRepository>(ReservationRepository);
//   });
//
//   describe('getAvailableDates', () => {
//     it('[should] 사용 가능한 날짜의 배열을 반환해야 합니다.', async () => {
//       jest.spyOn(service, 'getAvailableDates').mockReturnValue(Promise.resolve(['2024-07-01', '2024-07-02']));
//
//       const dates = await useCase.getAvailableDates();
//       expect(dates).toEqual(['2024-07-01', '2024-07-02']);
//       expect(service.getAvailableDates).toHaveBeenCalled();
//     });
//   });
//
//   describe('getAvailableSeats', () => {
//     it('[should] 사용 가능한 좌석 번호 배열을 반환해야 합니다.', async () => {
//       jest.spyOn(service, 'getAvailableSeats').mockReturnValue(Promise.resolve([1, 2, 3]));
//
//       const seats = await useCase.getAvailableSeats('2024-07-01');
//       expect(seats).toEqual([1, 2, 3]);
//       expect(service.getAvailableSeats).toHaveBeenCalledWith('2024-07-01');
//     });
//   });
//
//   describe('createReservation', () => {
//     it('[should] 새 예약을 생성해야 합니다', async () => {
//       const mockReservation = new Reservation(1, new Date('2024-07-01'), 1, 'user123', new Date());
//       jest.spyOn(service, 'createReservation').mockReturnValue(Promise.resolve(mockReservation));
//       let createReservationDto = new CreateReservationDto();
//       createReservationDto.userId = 'user123';
//       createReservationDto.date = '2024-07-01';
//       createReservationDto.seatNumber = 1;
//
//       const reservation = await useCase.createReservation(createReservationDto);
//       expect(reservation).toEqual(mockReservation);
//       expect(service.createReservation).toHaveBeenCalledWith( {"date": "2024-07-01", "seatNumber": 1, "userId": "user123"});
//     });
//   });
// });
