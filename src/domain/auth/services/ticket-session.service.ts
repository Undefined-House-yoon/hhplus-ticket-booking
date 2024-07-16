import { Injectable } from '@nestjs/common';

export interface TicketSession {
  id: number;
  userId: number;
  ticketViewedAt: Date;
  paymentDueAt: Date;
  status: ticketStatus;
}

export const enum ticketStatus {
  viewing,
  purchased,
  expired,
}

@Injectable()
export class TicketSessionService {
  private sessions: TicketSession[] = [];
  private currentId = 1;

  constructor() {
  }

  addSession(userId: number) {
    const session: TicketSession = {
      id: this.currentId++,
      userId,
      ticketViewedAt: new Date(),
      paymentDueAt: new Date(Date.now() + 15 * 60 * 1000), // 15분 후 결제 만료
      status: ticketStatus.viewing,
    };
    this.sessions.push(session);
  }

  findSessionByUserId(userId: number): TicketSession | undefined {
    return this.sessions.find(item => item.userId === userId && item.status === ticketStatus.viewing);
  }

  purchasedTicket(session: TicketSession) {
      session.status = ticketStatus.purchased;
  }

  removeExpiredSessions(): number {
    const now = new Date();
    const initialLength = this.sessions.length;
    this.sessions = this.sessions.filter(item => {
      if (item.paymentDueAt < now) {
        item.status = ticketStatus.expired;
        return false;
      }
      return true;
    });
    return initialLength - this.sessions.length;
  }
}
