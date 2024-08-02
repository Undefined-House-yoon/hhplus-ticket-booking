import { Injectable } from '@nestjs/common';
import { TicketSessionRepository } from '../repositories/ticket-session.repository';
import { TicketSession } from '../entities/ticket-session';



@Injectable()
export class TicketSessionService {

  constructor(private readonly ticketSessionRepository: TicketSessionRepository) {}
  /**
   * 새로운 세션을 추가합니다.
   * @param userId 사용자 ID
   * @returns 생성된 티켓 세션
   */
  async addSession(userId: number): Promise<TicketSession> {
    const newSession = TicketSession.create({ userId });
    return this.ticketSessionRepository.create(newSession);
  }
  /**
   * 사용자 ID로 세션을 찾습니다.
   * @param userId 사용자 ID
   * @returns 찾은 티켓 세션
   * @throws session 을 찾을 수 없는 경우 에러 발생
   */
  async findSessionByUserId(userId: number): Promise<TicketSession> {
    const session = await this.ticketSessionRepository.findByUserId(userId);
    if (session) return session;
    throw new Error('Session not found')
  }
  /**
   * 사용자가 티켓을 구매합니다.
   * @returns 업데이트된 티켓 세션
   * @throws 활성화된 시청 세션이 없는 경우
   * @param session
   */
  async purchaseTicket(session:TicketSession): Promise<TicketSession> {
    if (!session) {
      throw new Error('No active viewing session found for this user');
    }

    try {
      session.purchasedTicket();
      return this.ticketSessionRepository.update(session);
    } catch (error) {
      throw new Error('Failed to purchase ticket: ' + error.message);
    }
  }

  /**
   * 만료된 세션을 제거합니다. (스케줄러에서 호출)
   * @returns 제거된 세션의 수
   */
  async removeExpiredSessions(): Promise<number> {
    const sessions = await this.ticketSessionRepository.findAllViewingSessions();
    let expiredCount = 0;

    for (const session of sessions) {
      try {
        session.expiredTicket();
        await this.ticketSessionRepository.update(session);
      } catch (error) {
        expiredCount++;
      }
    }

    return this.ticketSessionRepository.removeExpired();
  }
}
