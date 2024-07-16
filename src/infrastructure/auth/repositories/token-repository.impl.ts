import { Injectable } from '@nestjs/common';
import { Token } from '../../../domain/auth/entities/token';
import { TokenRepository } from '../../../domain/auth/repositories/token.repository';

@Injectable()
export class TokenRepositoryImpl implements TokenRepository{
  private static tokens: Token[] = [];


  async save(token: Token): Promise<Token>  {
    const index = TokenRepositoryImpl.tokens.findIndex(u => u.getUserId() === token.getUserId());
    if (index !== -1) {
      TokenRepositoryImpl.tokens[index] = token;
    } else {
      TokenRepositoryImpl.tokens.push(token);
    }
    return token;
  }

}
