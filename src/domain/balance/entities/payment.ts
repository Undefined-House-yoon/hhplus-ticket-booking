export class Payment {
  constructor(
    public id: number,
    public userId: number,
    public reservationId: number,
    public amount: number,
    public status: 'success' | 'failed'
  ) {}
}
