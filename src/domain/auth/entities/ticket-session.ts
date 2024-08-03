export const enum TicketStatus {
  viewing = "viewing",
  purchased = "purchased",
  expired = "expired",
}

export class TicketSession {
  readonly id?: number;
  readonly userId: number;
  readonly paymentDueAt: Date; // 15분 후 결제 만료
  readonly ticketViewedAt: Date; // 티켓을 보기 시작한 시간
  private _status: TicketStatus;

  get status(): TicketStatus {
    return this._status;
  }

  purchasedTicket(): void {
    if (this._status == TicketStatus.expired) throw new Error('Session is expired');
    this._status = TicketStatus.purchased;
  }

  expiredTicket(): void {
    if (new Date() > this.paymentDueAt ){
      this._status = TicketStatus.expired;
      throw new Error('Session is expired');
    }
  }

  static create(params: {
    id?: number;
    userId: number;
    paymentDueAt?: Date;
    ticketViewedAt?: Date;
    status?: TicketStatus;
    expiredTime?: number;
  }): TicketSession {
    return new TicketSession(params);
  }

  private constructor(
    {
      id,
      userId,
      paymentDueAt,
      ticketViewedAt,
      status,
      expiredTime,
    }: {
      id?: number;
      userId: number;
      paymentDueAt?: Date;
      ticketViewedAt?: Date;
      status?: TicketStatus;
      expiredTime?: number;
    },
  ) {
    const time = expiredTime ?? 15 * 60 * 1000;
    this.id = id;
    this.userId = userId;
    this.paymentDueAt = paymentDueAt ?? new Date(Date.now() + time);
    this.ticketViewedAt = ticketViewedAt ?? new Date();
    this._status = status ?? TicketStatus.viewing;
  }
}
