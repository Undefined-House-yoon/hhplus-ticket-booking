import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';


/**
 * 토큰 테스트
 * */
@Injectable()
export class Token {
  private static JWT_SECRET:string = 'your-secret-key';
  readonly id?: number;
  readonly userId: number;
  readonly token: string;
  readonly entryTime: Date;
  readonly expiredAt: Date;


  /**
   * 토큰을 검증하고 유저 정보를 반환합니다.
   * @param token - 검증할 JWT 토큰
   * @returns 토큰에 포함된 유저 정보
   * @throws 토큰이 유효하지 않은 경우 에러 발생
   */
  static verifyToken(token: string): { userId: number }{
    try {
      const decoded = jwt.verify(token, Token.JWT_SECRET) as { userId: string };
      return { userId: parseInt(decoded.userId.split('_')[0]) };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  /**
   * 유저 ID와 대기열 정보를 포함한 JWT 토큰을 생성합니다.
   * @returns JWT 토큰 및 만료 시간
   */
  private generateTokenValue(): string {
    const payload = {userId: this.userId + '_token' };
    const expiresIn = '1h'; // 토큰의 유효 기간
    return jwt.sign(payload, Token.JWT_SECRET, { expiresIn });
  }

  static create(params: {
                  id?: number;
                  userId: number;
                  token?: string;
                  entryTime?: Date;
                  expiredAt?: Date;
                },
  ): Token {
    return new Token(params);
  }

  private constructor(
    {
      id,
      userId,
      token,
      entryTime,
      expiredAt,
    }: {
      id?: number;
      userId: number;
      token?: string;
      entryTime?: Date;
      expiredAt?: Date;
    },
  ) {
    const time = entryTime ?? new Date(Date.now());
    this.id = id;
    this.userId = userId;
    this.entryTime = time;
    this.expiredAt = expiredAt ?? new Date(time.getTime() + 5 * 60 * 1000);
    this.token = token ?? this.generateTokenValue();
  }
}
