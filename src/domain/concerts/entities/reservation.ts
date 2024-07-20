export enum ReservationStatus {
  PENDING = 'PENDING',//대기
  CONFIRMED = 'CONFIRMED',//확인
  CANCELLED = 'CANCELLED',//취소
  EXPIRED = 'EXPIRED'//만료
}

export class Reservation {
  readonly id: number;
  private _status: ReservationStatus; //예약상태
  readonly expiresAt: Date;//예약 날짝
  readonly userId: number;
  readonly seatId: number;
  readonly seatNumber: number;//좌석 번호
  readonly concertDetailId: number;
  readonly concertDate: Date;// 공연 날짜


  static create(params: {
    id: number,
    userId: number,
    seatNumber: number,
    concertDate: Date,
    status?: ReservationStatus,
    expiresAt: Date,
    seatId: number,
    concertDetailId: number
  }): Reservation {
    const dto = {
      ...params,
      status: params.status || ReservationStatus.PENDING,
    };
    return new Reservation(dto);
  }


  get status(): ReservationStatus {
    return this._status;
  }

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  canBeConfirmed(): boolean {
    return this._status === ReservationStatus.PENDING && !this.isExpired();
  }

  confirm(): void {
    if (!this.canBeConfirmed()) {
      throw new Error('Reservation cannot be confirmed');
    }
    this._status = ReservationStatus.CONFIRMED;
  }

  cancel(): void {
    if (this._status === ReservationStatus.CONFIRMED) {
      throw new Error('Confirmed reservation cannot be cancelled');
    }
    this._status = ReservationStatus.CANCELLED;
  }

  constructor({
                id,
                userId,
                seatNumber,
                concertDate,
                status,
                expiresAt,
                seatId,
                concertDetailId,
              }: {
    id: number,
    userId: number,
    seatNumber: number,
    concertDate: Date,
    status: ReservationStatus,
    expiresAt: Date,
    seatId: number,
    concertDetailId: number
  }) {
    this.id = id;
    this.userId = userId;
    this.seatNumber = seatNumber;
    this.concertDate = concertDate;
    this._status = status;
    this.expiresAt = expiresAt;
    this.seatId = seatId;
    this.concertDetailId = concertDetailId;
  }
}
