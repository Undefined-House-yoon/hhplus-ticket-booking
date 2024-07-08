import { Token } from '../entities/token';
import { Injectable } from '@nestjs/common';

export abstract class TokenRepository{
  abstract save(token:Token):Promise<Token>;
}


@Injectable()
export class TokenRepositoryImpl implements TokenRepository{
  async save(token: Token): Promise<Token>  {
    return token;
  }

}
