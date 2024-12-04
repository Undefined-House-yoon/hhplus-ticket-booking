import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('userQueue')
export class QueueProcessor extends WorkerHost {
  async process(job: Job<{ userId: number }, any, string>): Promise<any> {
    console.log(`Processing user ${job.data.userId}`);
    // 여기에 사용자 처리 로직을 구현합니다.
  }
}
