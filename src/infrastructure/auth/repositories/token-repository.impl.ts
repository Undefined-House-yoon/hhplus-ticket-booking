import { Injectable } from '@nestjs/common';
import { Token } from '../../../domain/auth/entities/token';
import { TokenRepository } from '../../../domain/auth/repositories/token.repository';
import { PrismaService } from '../../../../prisma/prisma.service';
import { QueueTokenMapper } from '../mapper/queu-token.mapper';

@Injectable()
export class QueueTokenRepositoryImpl implements TokenRepository {
  constructor(private prisma: PrismaService) {}

  async save(token: Token): Promise<Token> {
    const result = await this.prisma.queueToken.upsert({
      where: { token: token.token },
      update: {
        activated_at: token.entryTime,
        expires_at: token.expiredAt,
      },
      create: {
        user_id:token.userId,
        status:"created",
        token: token.token,
        expires_at: token.expiredAt,
      },
    });
    return QueueTokenMapper.toDomain(result);
  }

  async findByToken(token: string): Promise<Token | null> {
    const queueToken = await this.prisma.queueToken.findUnique({ where: { token } });
    return queueToken ? QueueTokenMapper.toDomain(queueToken) : null;
  }

  async findByUserId(userId: number): Promise<Token | null> {
    const queueToken = await this.prisma.queueToken.findFirst({ where: { user_id: userId } });
    return queueToken ? QueueTokenMapper.toDomain(queueToken) : null;
  }
}
