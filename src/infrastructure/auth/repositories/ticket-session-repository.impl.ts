import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { TicketSession, TicketStatus } from '../../../domain/auth/entities/ticket-session';
import { TicketSessionRepository } from '../../../domain/auth/repositories/ticket-session.repository';
import { TicketSessionMapper } from '../mapper/ticket-session.mapper';

@Injectable()
export class TicketSessionRepositoryImpl implements TicketSessionRepository {
  constructor(private prisma: PrismaService) {
  }

  async create(session: TicketSession): Promise<TicketSession> {
    const createdSession = await this.prisma.ticketSession.create({
      data: {
        user_id: session.userId,
        payment_due_at: session.paymentDueAt,
        ticket_viewed_at: session.ticketViewedAt,
        status: session.status,
      },
    });
    return TicketSessionMapper.toDomain(createdSession);
  }

  async findByUserId(userId: number): Promise<TicketSession | null> {
    const session = await this.prisma.ticketSession.findFirst({
      where: {
        user_id:userId,
        status: TicketStatus.viewing,
      },
    });
    return session ? TicketSessionMapper.toDomain(session) : null;
  }

  async update(ticketSession: TicketSession): Promise<TicketSession> {
    const updatedSession = await this.prisma.ticketSession.update({
      where: { id: ticketSession.id },
      data: {
        status: ticketSession.status,
      },
    });
    return TicketSessionMapper.toDomain(updatedSession);
  }

  async removeExpired(): Promise<number> {
    const result = await this.prisma.ticketSession.deleteMany({
      where: {
        status: TicketStatus.expired,
      },
    });
    return result.count;
  }

  async findAllViewingSessions(): Promise<TicketSession[]> {
    const results = await this.prisma.ticketSession.findMany({
      where: {
        payment_due_at: {
          lt: new Date()
        },
        status: TicketStatus.viewing
      }
    });
    return TicketSessionMapper.toDomainList(results)
  }
}
