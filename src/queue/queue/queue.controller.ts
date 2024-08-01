import { Body, Controller, Post } from '@nestjs/common';
import { QueueService } from './queue.service';

@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {
  }

  @Post('add')
  async addTask(@Body('task') task: string) {
    await this.queueService.addTask(task);
    return 'Task added to queue';
  }
}
