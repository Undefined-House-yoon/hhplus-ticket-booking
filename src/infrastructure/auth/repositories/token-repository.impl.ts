import { Injectable } from '@nestjs/common';
import { TokenRepository } from '../../../domain/auth/repositories/token.repository';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class QueueTokenRepositoryImpl implements TokenRepository {
  constructor(
              private readonly jwtService: JwtService) {
  }

  save(token: {userId:number,createdAt:Date,expiredAt:Date}): string {
    return this.jwtService.sign(token);
  }

  verify(token: string):any {
    const result = this.jwtService.verify(token);
    console.log(result);
    return result;
  }
}
