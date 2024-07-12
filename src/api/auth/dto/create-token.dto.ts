import { IsString } from 'class-validator';

export class CreateTokenDto {
  @IsString()
  userId: string;
}
