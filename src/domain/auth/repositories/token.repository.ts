import { Token } from '../entities/token';

export abstract class TokenRepository {
  abstract save(token: any): Promise<Token>;

  abstract findById(id: number): Promise<Token | null> ;

  abstract update(id: number, data: Partial<Token>): Promise<Token>

  abstract findPendingTokens(): Promise<Token[]>
}


