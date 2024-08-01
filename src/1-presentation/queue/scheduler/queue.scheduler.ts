import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { QueueFacade } from 'src/2-application/queue/queue.facade';

@Injectable()
export class QueueScheduler {
  constructor(private readonly queueFacade: QueueFacade) {}

  /**
   * 대기열 처리 스케줄
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async processQueue(): Promise<void> {
    await this.queueFacade.processQueue();
  }
}
