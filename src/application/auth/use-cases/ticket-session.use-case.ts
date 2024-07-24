import { Injectable } from '@nestjs/common';
import { TicketSessionService } from '../../../domain/auth/services/ticket-session.service';
import { TicketStatus } from '../../../domain/auth/entities/ticket-session';

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
    let session = await this.ticketSessionService.findSessionByUserId(userId);
    if (session.status !== TicketStatus.viewing) throw Error('Ticket already purchased');
    this.ticketSessionService.purchaseTicket(session);
  }

  /**
   * 만료된 티켓 세션 항목을 정리합니다.
   * @returns 제거된 항목의 수
   */
  async cleanupExpiredItems(): Promise<number> {
    return this.ticketSessionService.removeExpiredSessions();
  }
}
