import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

  //이거 폴링용
  async getQueueTokenStatus(id: number) {
    const token = await this.tokenRepository.findById(id);
    if (!token) {
      throw new HttpException('Token is Not Found', HttpStatus.NOT_FOUND);
    }
    return token.status;
  }

//이거 스케줄링용
  async processQueueTokens(): Promise<void> {
    const tokens:Token[] = await this.tokenRepository.findPendingTokens();

    for (const token of tokens) {
      token.setProcessing()
      await this.tokenRepository.update(token.id, { status: token.status });

      try {
        // 실제 처리 로직 (예: 외부 API 호출, 데이터 처리 등)
        token.setCompleted()
        await this.tokenRepository.update(token.id, { status: token.status });
      } catch (error) {
        token.setFailed()
        await this.tokenRepository.update(token.id, { status: token.status });
      }
    }
  }

}
