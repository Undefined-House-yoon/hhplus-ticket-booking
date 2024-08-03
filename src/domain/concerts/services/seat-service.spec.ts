import { SeatService } from './seat.service';
import { SeatRepository } from '../repositories/seat.repository';
import { Seat, SeatStatus } from '../entities/seat';
import { SeatMapper } from '../../../infrastructure/concerts/mapper/seat.mapper';

describe('SeatService', () => {
  let seatService: SeatService;
  let mockSeatRepository: jest.Mocked<SeatRepository>;
  const param = {id:1,seatNumber:1, concertDetailId:1,status: SeatStatus.AVAILABLE, }

  beforeEach(() => {
    mockSeatRepository = {
      findById: jest.fn(),
      findByConcertDetailId: jest.fn(),
      save: jest.fn(),
    } as jest.Mocked<SeatRepository>;

    seatService = new SeatService(mockSeatRepository);
  });
  describe('reserveSeat', () => {
    it('[should]빈 자리를 예약해야 합니다.', async () => {
      const mockSeat = Seat.create(param);
      mockSeatRepository.findById.mockResolvedValue(mockSeat);
      mockSeatRepository.save.mockResolvedValue(Seat.create({ ...param, status: SeatStatus.RESERVED }));

      const result = await seatService.reserveSeat(1);

      expect(result.status).toBe(SeatStatus.RESERVED);
      expect(mockSeatRepository.findById).toHaveBeenCalledWith(1);
      expect(mockSeatRepository.save).toHaveBeenCalled();
    });

    it('[should]좌석을 찾을 수 없으면 오류가 발생해야 합니다.', async () => {
      mockSeatRepository.findById.mockResolvedValue(null);
      await expect(seatService.reserveSeat(1)).rejects.toThrow('Seat not found');
    });
    it('[should] 동시에 예약을 시도할 때 하나의 요청만 성공해야 합니다.', async () => {
      const mockSeat = Seat.create(param);

      mockSeatRepository.findById.mockResolvedValue(mockSeat);
      mockSeatRepository.save.mockImplementation(async (seat) => {
        // 첫 번째 요청이 완료될 때까지 지연
        if (seat.status === SeatStatus.RESERVED) {
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
        return seat;
      });

      const reserveSeatPromise1 = seatService.reserveSeat(1);
      const reserveSeatPromise2 = seatService.reserveSeat(1);

      // 두 예약 요청을 동시에 실행
      const results = await Promise.allSettled([reserveSeatPromise1, reserveSeatPromise2]);

      // 성공 및 실패한 요청을 구분
      const fulfilled = results.filter(result => result.status === 'fulfilled');
      const rejected = results.filter(result => result.status === 'rejected');

      // 한 요청만 성공해야 함
      expect(fulfilled.length).toBe(1);
      expect(rejected.length).toBe(1);

      // 성공한 요청의 상태가 RESERVED여야 함
      expect(fulfilled[0].value.status).toBe(SeatStatus.RESERVED);

      // 실패한 요청은 "Seat is not available" 오류여야 함
      expect(rejected[0].reason.message).toBe('Seat is not available');

      // 리포지토리 호출 확인
      expect(mockSeatRepository.findById).toHaveBeenCalledTimes(2);
      expect(mockSeatRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('occupySeat', () => {
    it('[should]지정석을 차지해야 한다', async () => {
      const mockSeat = Seat.create({ ...param, status: SeatStatus.RESERVED });
      mockSeatRepository.findById.mockResolvedValue(mockSeat);
      mockSeatRepository.save.mockResolvedValue(Seat.create({ ...param, status: SeatStatus.OCCUPIED }));

      const result = await seatService.occupySeat(1);

      expect(result.status).toBe(SeatStatus.OCCUPIED);
      expect(mockSeatRepository.findById).toHaveBeenCalledWith(1);
      expect(mockSeatRepository.save).toHaveBeenCalled();
    });

    it('[should]좌석을 찾을 수 없으면 오류가 발생해야 합니다.', async () => {
      mockSeatRepository.findById.mockResolvedValue(null);

      await expect(seatService.occupySeat(1)).rejects.toThrow('Seat not found');
    });
  });

  describe('releaseSeat', () => {
    it('[should]점유된 좌석을 해제해야 함', async () => {
      const mockSeat = Seat.create({ ...param, status: SeatStatus.OCCUPIED });
      mockSeatRepository.findById.mockResolvedValue(mockSeat);
      mockSeatRepository.save.mockResolvedValue(Seat.create({ ...param, status: SeatStatus.AVAILABLE }));

      const result = await seatService.releaseSeat(1);

      expect(result.status).toBe(SeatStatus.AVAILABLE);
      expect(mockSeatRepository.findById).toHaveBeenCalledWith(1);
      expect(mockSeatRepository.save).toHaveBeenCalled();
    });

    it('[should]좌석을 찾을 수 없으면 오류가 발생해야 합니다.', async () => {
      mockSeatRepository.findById.mockResolvedValue(null);

      await expect(seatService.releaseSeat(1)).rejects.toThrow('Seat not found');
    });
  });

  describe('getAvailableSeats', () => {
    it('[should]이용 가능한 좌석만 반납해야 합니다', async () => {

      const mockSeats = [
        { id: 1, seatNumber: 1, concertDetailId: 1, status: SeatStatus.AVAILABLE },
        { id: 2, seatNumber: 2, concertDetailId: 1, status: SeatStatus.RESERVED },
        { id: 3, seatNumber: 3, concertDetailId: 1, status: SeatStatus.AVAILABLE },
        { id: 4, seatNumber: 4, concertDetailId: 1, status: SeatStatus.OCCUPIED }
      ];
      mockSeatRepository.findByConcertDetailId.mockResolvedValue(SeatMapper.toDomainList(mockSeats));

      const result = await seatService.getAvailableSeats(1);

      expect(result.length).toBe(2);
      expect(result.every(seat => seat.status === SeatStatus.AVAILABLE)).toBe(true);
      expect(mockSeatRepository.findByConcertDetailId).toHaveBeenCalledWith(1);
    });
  });
});
