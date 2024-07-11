import { QueueRepository } from 'src/4-infrastructure/queue/queue.repository';
import { QueueModel } from './queue.model';
import { QueueServiceCreateProps, QueueServiceGetProps } from './queue.props';
import { QueueStatusEnum } from 'src/4-infrastructure/queue/entities/queue.entity';
import * as dayjs from 'dayjs';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class QueueService {
  constructor(private readonly queueRepository: QueueRepository) {}

  async create(args: QueueServiceCreateProps): Promise<QueueModel> {
    let queue = await this.queueRepository.findByUserId(args.userId);

    if (!queue) {
      const expiredAt = dayjs().add(10, 'minute').toDate(); // 10분 후

      queue = await this.queueRepository.create({
        userId: args.userId,
        expiredAt,
        status: QueueStatusEnum.WAIT,
      });
    }

    // 현재 working인 마지막 queue을 조회
    const lastWorkingQueue = await this.queueRepository.findLastWorkingQueue();

    if (lastWorkingQueue != null) {
      queue.remain = queue.id - lastWorkingQueue.id;
    }

    return queue;
  }

  async get(args: QueueServiceGetProps): Promise<QueueModel> {
    const queue = await this.queueRepository.findByToken(args.token);

    if (!queue) {
      throw new NotFoundException('토큰이 존재하지 않습니다.');
    }

    // 만료시간이 지났다면
    if (
      queue.status == QueueStatusEnum.EXPIRED ||
      dayjs(queue.expiredAt).isBefore(dayjs())
    ) {
      throw new ForbiddenException('이미 만료된 토큰입니다.');
    }

    // 현재 working인 마지막 queue을 조회
    const lastWorkingQueue = await this.queueRepository.findLastWorkingQueue();
    if (lastWorkingQueue != null) {
      queue.remain = queue.id - lastWorkingQueue.id;
    }

    return queue;
  }

  async extend(queue: QueueModel): Promise<QueueModel> {
    queue.expiredAt = dayjs().add(10, 'minute').toDate(); // 현재부터 10분 연장

    return this.queueRepository.update(queue);
  }

  async processQueue(): Promise<void> {
    const workingQueueCount = await this.queueRepository.workingQueueCount();

    // 정원 : 100명
    if (100 <= workingQueueCount) {
      return;
    }

    const leftSpace = 100 - workingQueueCount;

    const waitingQueues =
      await this.queueRepository.findWaitingQueues(leftSpace);

    for (const queue of waitingQueues) {
      queue.expiredAt = dayjs().add(20, 'minute').toDate(); // 20분 연장
      queue.status = QueueStatusEnum.WORKING;
    }

    await this.queueRepository.bulkUpdate(waitingQueues);
  }

  async processExpiredQueue(): Promise<void> {
    const expiredQueues = await this.queueRepository.findExpiredQueues();

    for (const queue of expiredQueues) {
      queue.status = QueueStatusEnum.EXPIRED;
    }

    await this.queueRepository.bulkUpdate(expiredQueues);
  }
}
