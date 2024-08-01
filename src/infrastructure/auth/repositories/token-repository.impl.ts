import { Injectable } from '@nestjs/common';
import { Token } from '../../../domain/auth/entities/token';
import { TokenRepository } from '../../../domain/auth/repositories/token.repository';
import { PrismaService } from '../../../../prisma/prisma.service';
import { QueueTokenMapper } from '../mapper/queu-token.mapper';

@Injectable()
export class QueueTokenRepositoryImpl implements TokenRepository {
  constructor(private prisma: PrismaService) {
  }

  async save(token: Token): Promise<Token> {
    const result = await this.prisma.queueToken.upsert({
      where: { token: token.token },
      update: {
        activated_at: token.activatedAt,
        expires_at: token.expiredAt,
      },
      create: {
        user_id: token.userId,
        status: 'created',
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

  async findById(id: number): Promise<Token | null> {
    const queueToken = await this.prisma.queueToken.findUnique({ where: { id } });
    return QueueTokenMapper.toDomain(queueToken);
  }

  async findPendingTokens(): Promise<Token[]> {
    const queueTokens = await this.prisma.queueToken.findMany({ where: { status: 'PENDING' } });
    return QueueTokenMapper.toDomainList(queueTokens);
  }

  async update(id: number, data: Partial<Token>): Promise<Token> {
    this.prisma.queueToken.update({ where: { id }, data });
    return Promise.resolve(undefined);
  }
}
