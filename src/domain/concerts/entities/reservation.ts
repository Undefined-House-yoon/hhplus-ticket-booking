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

  // 객체 생성을 위한 static 메서드
  static create(params: {
    id: number,
    userId: number,
    seatNumber: number,
    concertDate: Date,
    status?: ReservationStatus,
    expiresAt: Date,
    seatId: number,
    concertDetailId: number,
  }): Reservation {
    return new Reservation({
      ...params,
      status: params.status || ReservationStatus.PENDING,
    });
  }

  // getter 메서드
  get status(): ReservationStatus {
    return this._status;
  }

  // 예약 만료 확인
  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  // 예약 확인 가능 여부 확인
  canBeConfirmed(): boolean {
    if (this.isExpired()) {
      this._status = ReservationStatus.EXPIRED;
      return false;
    }
    return this._status === ReservationStatus.PENDING;
  }


  // 예약 확인
  confirm(): void {
    if (!this.canBeConfirmed()) {
      throw new Error('Reservation cannot be confirmed');
    }
    this._status = ReservationStatus.CONFIRMED;
  }

  // 예약 취소
  cancel(): void {
    if (this._status === ReservationStatus.CONFIRMED) {
      throw new Error('Confirmed reservation cannot be cancelled');
    }
    this._status = ReservationStatus.CANCELLED;
  }

  // 예약 만료 처리
  expire(): void {
    if (this.isExpired() && this._status === ReservationStatus.PENDING) {
      this._status = ReservationStatus.EXPIRED;
    } else {
      throw new Error('Reservation cannot be expired');
    }
  }

  // private 생성자
  private constructor({
                        id,
                        userId,
                        seatNumber,
                        concertDate,
                        status,
                        expiresAt,
                        seatId,
                        concertDetailId,
                      }: {
    id: number;
    userId: number;
    seatNumber: number;
    concertDate: Date;
    status: ReservationStatus;
    expiresAt: Date;
    seatId: number;
    concertDetailId: number;
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
