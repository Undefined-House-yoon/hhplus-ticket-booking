import { Injectable } from '@nestjs/common';
import { Token } from '../../../domain/auth/entities/token';
import { TokenRepository } from '../../../domain/auth/repositories/token.repository';

@Injectable()
export class TokenRepositoryImpl implements TokenRepository{
  async save(token: Token): Promise<Token>  {
    return token;
  }

}
