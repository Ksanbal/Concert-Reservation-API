import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { QueueFacade } from 'src/2-application/queue/queue.facade';

@Injectable()
export class QueueScheduler {
  constructor(private readonly queueFacade: QueueFacade) {}

  /**
   * 만료된 토큰 삭제 스케줄
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async deleteExpiredQueues(): Promise<void> {
    await this.queueFacade.deleteExpiredQueues();
  }

  /**
   * 토큰 활성화 스케줄
   */
  @Cron(CronExpression.EVERY_10_SECONDS)
  async activeQueues(): Promise<void> {
    await this.queueFacade.activeQueues();
  }
}
