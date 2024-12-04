import { TicketSessionService } from '../../../domain/auth/services/ticket-session.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ActivateTicketsSessionUseCase{
  constructor(private readonly ticketSessionService: TicketSessionService) {
  }
  /**
   * 티켓 세션을 생성합니다..
   * @returns 생성된 항목 수
   */
  async activateSessions(userIds: number[]): Promise<number> {
    return this.ticketSessionService.addSessions(userIds);
  }
}
