import { Injectable } from '@nestjs/common';
import { TicketSessionService, ticketStatus } from '../../../domain/auth/services/ticket-session.service';

@Injectable()
export class TicketSessionUseCase {
  constructor(private readonly ticketSessionService: TicketSessionService) {
  }

  /**
   * 사용자가 티켓 조회를 시작합니다.
   * @param userId 사용자 ID
   */
  async startViewing(userId: number): Promise<void> {
    if (userId == null) throw Error('Invalid user ID');
    this.ticketSessionService.addSession(userId);
  }

  /**
   * 사용자가 티켓 결제를 완료합니다.
   * @param userId 사용자 ID
   */
  async completePurchase(userId: number): Promise<void> {
    let session = this.ticketSessionService.findSessionByUserId(userId);
    if (!(!!session)) throw Error('Session is Not Found');
    if (session.status !== ticketStatus.viewing) throw Error('Ticket already purchased');
    this.ticketSessionService.purchasedTicket(session);
  }

  /**
   * 만료된 티켓 세션 항목을 정리합니다.
   * @returns 제거된 항목의 수
   */
  async cleanupExpiredItems(): Promise<number> {
    return this.ticketSessionService.removeExpiredSessions();
  }
}
