import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { QueueService } from '../../domain/auth/services/queue.service';
import { ActivateTicketsSessionUseCase } from '../../application/auth/use-cases/activate-tickets-session.use-case';

@Injectable()
export class QueueScheduler {
  private readonly logger = new Logger(QueueScheduler.name);

  constructor(
    private readonly queueService: QueueService,
    private readonly activateTicketsSessionUseCase:ActivateTicketsSessionUseCase
  ) {}


  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    this.logger.debug('Starting scheduled queue processing');

    // 1. 5분 이상 경과한 토큰들을 조회하여 만료할 항목들을 가져옴
    const expiredTokenList = await this.queueService.getTokensAfter5Minutes();
    const expiredTokenIds = expiredTokenList.map(({ id }) => id);
    this.logger.debug(`Expired token IDs: ${expiredTokenIds.length}`);

    // 2. 최대 100명의 사용자를 활성화할 항목 리스트로 가져옴
    const tokenListToBeActivated = await this.queueService.getTokenListToBeActivated(Math.min(expiredTokenIds.length, 100));
    if (tokenListToBeActivated.length === 0) {
      return;
    }
    this.logger.debug(`tokenListToBeActivated : ${tokenListToBeActivated.length}`);
    const activeTokenIds=[]
    const activeSessionUserIds = []
    tokenListToBeActivated.forEach(({ id,userId })=>{
      activeTokenIds.push(id);
      activeSessionUserIds.push(userId);
    })
    this.logger.debug(`Active token IDs: ${activeTokenIds.length} ${activeSessionUserIds.length}`);

    // 3. 만료 및 활성화 작업을 병렬로 실행
    await Promise.all([
      this.queueService.activatePendingTokens(activeTokenIds),
      this.activateTicketsSessionUseCase.activateSessions(activeSessionUserIds),
      // this.queueService.expireOldTokens(expiredTokenIds),
    ]);

    this.logger.debug('Completed scheduled queue processing');
  }
}
