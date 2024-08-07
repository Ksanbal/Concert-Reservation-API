import { Injectable } from '@nestjs/common';
import { QueueModel } from 'src/3-domain/queue/queue.model';
import {
  QueueServiceCreateProps,
  QueueServiceExtendGetProps,
  QueueServiceGetProps,
} from 'src/3-domain/queue/queue.props';
import { QueueService } from 'src/3-domain/queue/queue.service';
import { UsersService } from 'src/3-domain/users/users.service';
import { PaymentsPaiedEvent } from 'src/events/event';

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
    const user = await this.usersService.get({ id: args.userId });

    return this.queueService.create({ userId: user.id });
  }

  /**
   * 대기열 토큰 유효성 체크
   */
  async get(args: QueueServiceGetProps): Promise<QueueModel> {
    return await this.queueService.get(args);
  }

  /**
   * 대기열 토큰 유효기간 연장
   */
  async extend(args: QueueServiceExtendGetProps): Promise<QueueModel> {
    return this.queueService.extend(args.token);
  }

  /**
   * 대기열 토큰 만료 처리 스케줄
   */
  async deleteExpiredQueues() {
    await this.queueService.processExpiredQueue();
  }

  /**
   * 토큰 활성화 스케줄
   */
  async activeQueues() {
    await this.queueService.activeQueues();
  }

  /**
   * 토큰 비활성화
   */
  async expire(event: PaymentsPaiedEvent) {
    const { queue } = event;
    await this.queueService.expire(queue);
  }
}
