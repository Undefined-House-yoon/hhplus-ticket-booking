import { Token } from '../entities/token';

export abstract class TokenRepository{
  abstract save(token:Token):Promise<Token>;
}


