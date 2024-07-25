import { Injectable } from '@nestjs/common';
import { Token } from '../entities/token';
import { TokenRepository } from '../repositories/token.repository';
import { CreateTokenDto } from '../../../api/Identity/dto/create-token.dto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TokenService {

  constructor(
              private readonly tokenRepository: TokenRepository) {
  }

  async createToken(createTokenDto: CreateTokenDto): Promise<Token> {
    const token = Token.create(createTokenDto);
    return await this.tokenRepository.save(token);
  }

  /**
   * 토큰을 검증하고 유저 정보를 반환합니다.
   * @param token - 검증할 JWT 토큰
   * @returns 토큰에 포함된 유저 정보
   * @throws 토큰이 유효하지 않은 경우 에러 발생
   */
  verifyToken(token: string): { userId: number }{
    return Token.verifyToken(token);
  }

}
