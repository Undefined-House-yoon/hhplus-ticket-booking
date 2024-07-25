import { TicketSession } from '../../../domain/auth/entities/ticket-session';

export class TicketSessionMapper {
  static toDomain(prismaTicketSession: any): TicketSession {
    return TicketSession.create({
      id: prismaTicketSession.id,
      userId: prismaTicketSession.user_id,
      status: prismaTicketSession.status,
      ticketViewedAt: prismaTicketSession.ticket_viewed_at,
      paymentDueAt: prismaTicketSession.payment_due_at,
    });
  }

  static toDomainList(prismaTicketSession: any[]): TicketSession[] {
    return prismaTicketSession.map(this.toDomain);
  }
}
