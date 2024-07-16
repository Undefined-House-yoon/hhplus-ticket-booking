import { Injectable } from '@nestjs/common';
import { Token } from '../entities/token';
import { TokenRepository } from '../repositories/token.repository';
import { CreateTokenDto } from '../../../api/Identity/dto/create-token.dto';

@Injectable()
export class AuthService {

  constructor(
              private readonly tokenRepository: TokenRepository) {
  }

  async createToken(createTokenDto: CreateTokenDto): Promise<Token> {
    const token = new Token(createTokenDto.userId);
    return await this.tokenRepository.save(token);
  }
}
