export enum SeatStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  OCCUPIED = 'OCCUPIED',
}
export function mapPrismaSeatToSeatStatus(status: string): SeatStatus {
  switch (status) {
    case 'AVAILABLE':
      return SeatStatus.AVAILABLE;
    case 'RESERVED':
      return SeatStatus.RESERVED;
    case 'OCCUPIED':
      return SeatStatus.OCCUPIED;
    default:
      throw new Error(`Invalid seat status: ${status}`);
  }
}

export class Seat {
  readonly id: number;
  readonly concertDetailId: number;
  readonly seatNumber: number;
  private _status: SeatStatus;

  /**
   * Seat 생성자.
   * private으로 설정하여 외부에서 직접 호출하지 못하도록 합니다.
   * @param params Seat 객체 생성에 필요한 매개변수
   */
  private constructor(params: {
    id: number,
    concertDetailId: number,
    seatNumber: number,
    status: SeatStatus
  }) {
    this.id = params.id;
    this.concertDetailId = params.concertDetailId;
    this.seatNumber = params.seatNumber;
    this._status = params.status;
  }

  /**
   * Seat 객체 생성을 위한 static 메서드.
   * @param params Seat 객체 생성에 필요한 매개변수
   * @returns 생성된 Seat 객체
   */
  static create(params: {
    id: number,
    concertDetailId: number,
    seatNumber: number,
    status?: SeatStatus
  }): Seat {
    return new Seat({
      ...params,
      status: params.status || SeatStatus.AVAILABLE
    });
  }

  /**
   * 좌석 상태를 가져옵니다.
   * @returns 현재 좌석 상태
   */
  get status(): SeatStatus {
    return this._status;
  }

  /**
   * 좌석을 예약합니다.
   * @throws 좌석이 이용 가능 상태가 아니면 에러를 던집니다.
   */
  reserve(): void {
    if (this._status !== SeatStatus.AVAILABLE) {
      throw new Error('Seat is not available');
    }
    this._status = SeatStatus.RESERVED;
  }

  /**
   * 좌석을 점유합니다.
   * @throws 좌석이 예약 상태가 아니면 에러를 던집니다.
   */
  occupy(): void {
    if (this._status !== SeatStatus.RESERVED) {
      throw new Error('Seat is not reserved');
    }
    this._status = SeatStatus.OCCUPIED;
  }

  /**
   * 좌석을 해제합니다.
   * @throws 좌석이 이미 이용 가능 상태면 에러를 던집니다.
   */
  release(): void {
    if (this._status === SeatStatus.AVAILABLE) {
      throw new Error('Seat is already available');
    }
    this._status = SeatStatus.AVAILABLE;
  }
}
