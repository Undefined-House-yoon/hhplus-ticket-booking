export class Payment {
   readonly id?: number;
   readonly userId: number;
   readonly reservationId: number;
   readonly amount: number;
   private _status: PaymentStatus;
   readonly createdAt: Date;


  get status(): PaymentStatus {
    return this._status;
  }

  set status(value: PaymentStatus) {
    this._status = value;
  }

  static createPayment(
    {
      id,
      userId,
      reservationId,
      amount,
      status,
      createdAt,
    }: {
      id?: number,
      userId: number,
      reservationId:number,
      amount: number,
      status: string,
      createdAt?: Date
    },
  ): Payment {
    const paymentStatus = Payment.getPaymentStatus(status);
    return new Payment({
      id:id,
      userId:userId,
      reservationId:reservationId,
      amount:amount,
      status:paymentStatus,
      createdAt:createdAt??new Date(),
    });
  }

  static getPaymentStatus(status: string): PaymentStatus | undefined {
    switch (status.toLowerCase()) {
      case PaymentStatus.Success:
        return PaymentStatus.Success;
      case PaymentStatus.Failed:
        return PaymentStatus.Failed;
      default:
        return undefined;
    }
  }

  private constructor({
                        id,
                        userId,
                        reservationId,
                        amount,
                        status,
                        createdAt,
                      }: {
                        id?: number,
                        userId: number,
                        reservationId: number,
                        amount: number,
                        status: PaymentStatus,
                        createdAt: Date
                      },
  ) {
    this.id = id;
    this.userId = userId;
    this.reservationId = reservationId;
    this.amount = amount;
    this._status = status;
    this.createdAt = createdAt;
  }
}


export enum PaymentStatus {
  Success = 'success',
  Failed = 'failed'
}
