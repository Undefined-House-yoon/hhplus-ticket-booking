export class Reservation {
  constructor(
    public id: number,
    public date: Date,
    public seatNumber: number,
    public userId: string,
    public expiresAt: Date,
    public isPaid: boolean = false
  ) {}
}
