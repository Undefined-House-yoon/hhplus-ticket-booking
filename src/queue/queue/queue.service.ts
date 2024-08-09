import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class QueueService {
  constructor(@InjectQueue('task-queue') private taskQueue: Queue) {}

  async addTask(task: string) {
    await this.taskQueue.add(
      'task',
      { task },
      {
        removeOnComplete: { age: 15 }, // 작업 완료 후 1시간 (3600초) 후 제거
        removeOnFail: { age: 15 }, // 작업 실패 후 1시간 (3600초) 후 제거
      }
    );
    console.log(`Task '${task}' added to queue.`);
  }
}
