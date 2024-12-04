import { IsDate, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * CreateReservationDto는 예약 생성을 위한 데이터 전송 객체입니다.
 *
 * @property {number} userId - 예약을 만드는 사용자 ID
 * @property {number} concertsDetailId - 콘서트 세부 정보 ID
 * @property {number} seatId - 예약된 좌석 ID
 * @property {number} seatNumber - 예약된 좌석 번호
 * @property {string} token - 예약을 위한 인증 토큰
 */
export class CreateReservationDto {

  @ApiProperty()
  @IsNumber()
  userId: number;


  @ApiProperty()
  @IsNumber()
  concertsDetailId: number;

  @ApiProperty()
  @IsDate()
  date: Date;

  @ApiProperty()
  @IsNumber()
  seatId: number;


  @ApiProperty()
  @IsNumber()
  seatNumber: number;

  @ApiProperty()
  @IsString()
  token: string;
}
