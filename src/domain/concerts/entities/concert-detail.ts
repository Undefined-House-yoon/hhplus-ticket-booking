export class ConcertDetail {
  readonly id: number;
  readonly concertId: number;
  readonly totalSeats: number;
  readonly location: string;
  readonly price: number;
  readonly openDate: Date;
  readonly date: Date;





  private constructor({
                        id,
                        concert_id,
                        total_seats,
                        location,
                        price,
                        open_date,
                        date,
                      }) {
    this.id = id;
    this.concertId = concert_id;
    this.totalSeats = total_seats;
    this.location = location;
    this.price = price;
    this.openDate = open_date;
    this.date = date;
  }

  static create(
    param: {
      id: number;
      concert_id: number;
      total_seats: number;
      location: string;
      price: number;
      open_date: Date;
      date: Date;
    },
  ): ConcertDetail {
    return new ConcertDetail({...param});
  }

}
