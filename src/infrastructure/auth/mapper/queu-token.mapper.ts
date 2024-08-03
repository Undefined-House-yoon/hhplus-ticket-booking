import { Token } from '../../../domain/auth/entities/token';

export class QueueTokenMapper {
  static toDomain(prismaToken: any): Token {
    return Token.create({
      id: prismaToken.id,
      userId: prismaToken.user_id,
      entryTime: prismaToken.created_at.getTime(),
      expiredAt: prismaToken.expires_at.getTime(),
      token: prismaToken.token
    });
  }

  static toPrisma(token: Token): any {
    return {
      user_id: token.userId,
      token: token.token,
      status: 'ACTIVE', // 상태는 도메인 모델에 없으므로 기본값 설정
      created_at: new Date(token.entryTime),
      expires_at: new Date(token.expiredAt)
    };
  }
}
