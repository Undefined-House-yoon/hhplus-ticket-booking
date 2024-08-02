import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../../domain/user/entites/user';

export class RefundResponseDto {
  @ApiProperty()
  user: User;
  @ApiProperty()
  balance : number;
}
