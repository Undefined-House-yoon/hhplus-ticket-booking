import { TicketSession } from '../../../domain/auth/entities/ticket-session';

import { TicketSession as PrismaTicketSession} from '@prisma/client';

export class TicketSessionMapper {
  static toDomain(prismaTicketSession: PrismaTicketSession): TicketSession {
    return TicketSession.create({
      id: prismaTicketSession.id,
      userId: prismaTicketSession.user_id,
      status: prismaTicketSession.status,
      ticketViewedAt: prismaTicketSession.ticket_viewed_at,
      paymentDueAt: prismaTicketSession.payment_due_at,
    });
  }



  static toDomainList(prismaTicketSession: PrismaTicketSession[]): TicketSession[] {
    return prismaTicketSession.map(this.toDomain);
  }
  static fromDomain(ticketSession: TicketSession): PrismaTicketSession {
    const result  = {
      user_id:ticketSession.userId,
      status:ticketSession.status,
      ticket_viewed_at:ticketSession.ticketViewedAt,
      payment_due_at:ticketSession.paymentDueAt,
    };
    return result as PrismaTicketSession;
  }
  static fromDomainList(ticketSession: TicketSession[]): PrismaTicketSession[]{
    return ticketSession.map(this.fromDomain)
  }
}
