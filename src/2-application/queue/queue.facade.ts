import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { QueueModel } from 'src/3-domain/queue/queue.model';
import {
  QueueServiceCreateProps,
  QueueServiceGetProps,
} from 'src/3-domain/queue/queue.props';
import { QueueService } from 'src/3-domain/queue/queue.service';
import { UsersService } from 'src/3-domain/users/users.service';

@Injectable()
export class QueueFacade {
  constructor(
    private readonly usersService: UsersService,
    private readonly queueService: QueueService,
  ) {}

  /**
   * 대기열 토큰 발급
   */
  async create(args: QueueServiceCreateProps): Promise<QueueModel> {
    await this.usersService.get({ id: args.userId });

    return this.queueService.create(args);
  }

  /**
   * 대기열 토큰 유효성 체크
   */
  async get(args: QueueServiceGetProps): Promise<QueueModel> {
    return this.queueService.get(args);
  }

  /**
   * 대기열 토큰 유효기간 연장
   */
  async extend(args: QueueServiceGetProps): Promise<QueueModel> {
    const queue = await this.queueService.get(args);

    return this.queueService.extend(queue);
  }

  /**
   * 대기열 처리 스케줄
   */
  @Cron(CronExpression.EVERY_30_SECONDS)
  async processQueue(): Promise<void> {
    // 대기열 토큰 만료 처리 스케줄
    await this.queueService.processExpiredQueue();

    // 대기열 토큰 상태 및 만료시간 업데이트 스케줄
    await this.queueService.processQueue();
  }
}
