import { Injectable, Inject } from '@nestjs/common';
import { UserId } from '../vo/user-id.vo';
import { Token } from '../entities/token';
import { TokenRepository } from '../repositories/token.repository';
import { CreateTokenDto } from '../../../api/auth/dto/create-token.dto';

@Injectable()
export class AuthService {

  constructor(
              private readonly tokenRepository: TokenRepository) {
  }

  async createToken(createTokenDto: CreateTokenDto): Promise<Token> {
    const userId = new UserId(createTokenDto.userId);
    const token = new Token(userId);
    return await this.tokenRepository.save(token);
  }
}
