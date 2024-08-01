import { Processor, Process, OnQueueCompleted, OnQueueFailed } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('task-queue')
export class QueueProcessor {
  @Process('task')
  async handleTask(job: Job) {
    console.log(`Processing task: ${job.data.task}`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`Task '${job.data.task}' processed successfully`);
  }

  @OnQueueCompleted()
  async onComplete(job: Job) {
    console.log(`Job ${job.id} completed`);
    const state = await job.getState();
    console.log(`Job state after completion: ${state}`);
  }

  @OnQueueFailed()
  async onFailed(job: Job, error: any) {
    console.log(`Job ${job.id} failed: ${error}`);
    const state = await job.getState();
    console.log(`Job state after failure: ${state}`);
  }
}
