import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class BullQueueService {
  // 생성자에서 @InjectQueue 데코레이터를 사용하여 'userQueue'라는 이름의 BullMQ 큐를 주입받습니다.
  constructor(@InjectQueue('userQueue') private userQueue: Queue) {}

  // 이 메소드는 사용자 ID를 받아 큐에 추가하고, 해당 작업의 상태와 위치를 반환합니다.
  async addToQueue(userId: number): Promise<{ status: boolean; position: number }> {
    // userQueue에 'processUser'라는 이름의 새 작업을 추가합니다. 작업 데이터로 userId를 전달합니다.
    const job = await this.userQueue.add('processUser', { userId });

    // 현재 큐의 작업 수를 가져옵니다.
    const jobCounts = await this.userQueue.getJobCounts();

    // 작업의 상태(처리되지 않았으므로 false)와 위치(대기 중 + 처리 중인 작업의 수)를 반환합니다.
    return {
      status: false, // 새로 추가된 작업은 아직 처리되지 않았으므로 false
      position: jobCounts.waiting + jobCounts.active,
    };
  }

  async getQueueOrder(): Promise<{ userId: number; position: number }[]> {
    const jobs = await this.userQueue.getJobs(['waiting', 'active']);

    return jobs.map((job, index) => ({
      userId: job.data.userId,
      position: index + 1,
    }));
  }
}
