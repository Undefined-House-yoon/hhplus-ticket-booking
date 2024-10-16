import { Token } from '../entities/token';

export abstract class TokenRepository {
  abstract save(token: any): string;
  abstract verify(token: any):Token;

}


