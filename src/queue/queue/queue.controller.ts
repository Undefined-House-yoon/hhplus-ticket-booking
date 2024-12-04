import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { BullQueueService } from './bull-queue.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: BullQueueService) {}

  @Post('add')
  @UseGuards(AuthGuard('jwt'))
  async addToQueue(@Req() req)
  {
    const user= req.user;
    return this.queueService.addToQueue(user.userId);
  }
}
