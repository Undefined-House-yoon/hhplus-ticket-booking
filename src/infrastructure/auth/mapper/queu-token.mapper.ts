import { Token } from '../../../domain/auth/entities/token';
import { QueueItem } from '../../../domain/auth/entities/queue-item';

export class QueueTokenMapper {
  static toDomain(prismaToken: any): Token {
    return Token.create({
      id: prismaToken.id,
      userId: prismaToken.user_id,
      createdAt: prismaToken.created_at,
      expiredAt: prismaToken.expires_at,
      token: prismaToken.token,
      activatedAt:prismaToken.activated_at,
    });
  }

  static toPrisma(token: Token): any {
    return {
      user_id: token.userId,
      token: token.token,
      status: token.status, // 상태는 도메인 모델에 없으므로 기본값 설정
      created_at: token.createdAt,
      expires_at: token.expiredAt,
      activated_at:token.activatedAt,
    };
  }

  static toDomainList(prismaTokens: any[]): Token[] {
    return prismaTokens.map(this.toDomain);
  }
}
