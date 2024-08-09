import { TicketSession } from '../entities/ticket-session';

export abstract class TicketSessionRepository {
  abstract create(ticketSession: TicketSession): Promise<TicketSession>;

  abstract findByUserId(userId: number): Promise<TicketSession | null>;

  abstract findAllViewingSessions(): Promise<TicketSession[]>;

  abstract update(ticketSession: TicketSession): Promise<TicketSession>;

  abstract removeExpired(): Promise<number>;

  abstract addSessions(sessions: TicketSession[]): Promise<number>;
}
