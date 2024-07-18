import { Token } from '../../../domain/auth/entities/token';

export class TokenMapper {
  static fromPrisma(prismaToken:any): Token {
    return Token.create({
      userId: prismaToken.userId,
      expiredAt:prismaToken.createdAt.getTime(),
      value:prismaToken.token,
      entryTime:prismaToken.createdAt.getTime()+(5 * 60 * 1000),
    }
    );
  }

  toPrisma(token:Token): any {
    return {
      userId: token.getUserId(),
      token: token.getValue(),
    }
  }
}

