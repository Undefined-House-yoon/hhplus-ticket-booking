import { Injectable } from '@nestjs/common';
import { Token } from '../../../domain/auth/entities/token';
import { TokenRepository } from '../../../domain/auth/repositories/token.repository';
import { PrismaService } from '../../../../prisma/prisma.service';
import { TokenMapper } from '../mapper/token.mapper';

@Injectable()
export class TokenRepositoryImpl implements TokenRepository{
  private static tokens: Token[] = [];
  constructor(private prisma:PrismaService) {
  }


  // async save(token: Token): Promise<Token>  {
  //   const index = TokenRepositoryImpl.tokens.findIndex(u => u.getUserId() === token.getUserId());
  //   if (index !== -1) {
  //     TokenRepositoryImpl.tokens[index] = token;
  //   } else {
  //     TokenRepositoryImpl.tokens.push(token);
  //   }
  //   return token;
  // }

  async save(token: Token): Promise<Token> {
     const result = await this.prisma.token.upsert({
      where: { userId: token.getUserId() },
      update: { token: token.getValue() },
      create: {
        userId: token.getUserId(),
        token: token.getValue(),
      },
    });
     return TokenMapper.fromPrisma(result)

  }

}
