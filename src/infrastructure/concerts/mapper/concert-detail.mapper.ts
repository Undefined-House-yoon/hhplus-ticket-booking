import { ConcertDetail } from '../../../domain/concerts/entities/concert-detail';

export class ConcertDetailMapper {
  static toDomain(prismaConcertDetail: any): ConcertDetail {
    return ConcertDetail.create({
      id: prismaConcertDetail.id,
      concert_id: prismaConcertDetail.concert_id,
      total_seats: prismaConcertDetail.total_seats,
      location: prismaConcertDetail.location,
      price: prismaConcertDetail.price,
      open_date: prismaConcertDetail.open_date,
      date: prismaConcertDetail.date,
    });
  }

  static toDomainList = (prismaConcertDetails: any[]): ConcertDetail[] => prismaConcertDetails.map(this.toDomain);
}
