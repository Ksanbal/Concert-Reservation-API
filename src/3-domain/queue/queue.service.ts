import { QueueModel } from './queue.model';
import {
  QueueServiceCreateProps,
  QueueServiceGetProps,
  QueueServiceGetWorkingProps,
} from './queue.props';
import { QueueStatusEnum } from 'src/4-infrastructure/queue/entities/queue.entity';
import * as dayjs from 'dayjs';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import Redlock from 'redlock';
import Redis from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { QueueRedisRepository } from 'src/4-infrastructure/queue/queue-redis.repository';

@Injectable()
export class QueueService {
  constructor(
    @InjectRedis()
    private readonly redis: Redis,
    private readonly queueRedisRepository: QueueRedisRepository,
  ) {}

  /**
   * Redis의 패턴을 이용해 queue 조회
   * @param pattern uuid:userId:expiredAt 형식의 패턴
   * @returns
   */
  private async getQueueByPattern(pattern: string): Promise<QueueModel | null> {
    // ActiveQueue에서 조회
    let queue =
      await this.queueRedisRepository.findByPatternFromActiveQueue(pattern);
    if (queue) return queue;

    // WaitingQueue에서 조회
    queue =
      await this.queueRedisRepository.findByPatternFromWaitingQueue(pattern);

    if (queue) {
      const value = Buffer.from(queue.token, 'base64').toString();
      queue.remain =
        await this.queueRedisRepository.getRankByValueFromWaitingQueue(value);
    }

    return queue;
  }

  async create(args: QueueServiceCreateProps): Promise<QueueModel> {
    const redlock = new Redlock([this.redis]);
    const lock = await redlock.acquire(['queue'], 2000);

    let queue = await this.getQueueByPattern(`*:${args.userId}:*`);

    if (!queue) {
      const expiredAt = dayjs().add(10, 'minute').toDate(); // 10분 후

      queue = await this.queueRedisRepository.createToWaitingQueue(
        args.userId,
        new Date(),
        expiredAt,
      );

      const value = Buffer.from(queue.token, 'base64').toString();
      queue.remain =
        await this.queueRedisRepository.getRankByValueFromWaitingQueue(value);
    }

    await lock.release();

    return queue;
  }

  async get(args: QueueServiceGetProps): Promise<QueueModel> {
    const pattern = Buffer.from(args.token, 'base64').toString();
    const queue = await this.getQueueByPattern(pattern);

    if (!queue) {
      throw new NotFoundException('토큰이 존재하지 않습니다.');
    }

    if (queue.expiredAt < new Date()) {
      throw new ForbiddenException('이미 만료된 토큰입니다.');
    }

    return queue;
  }

  async extend(token: string): Promise<QueueModel> {
    const value = Buffer.from(token, 'base64').toString();
    const queue = await this.getQueueByPattern(value);

    if (!queue) {
      throw new NotFoundException('토큰이 존재하지 않습니다.');
    }

    const newExpiredAt = dayjs().add(10, 'minute').toDate(); // 현재부터 10분 연장

    let newQueue;
    if (queue.status == QueueStatusEnum.WAIT) {
      // WaitingQueue에서 삭제
      await this.queueRedisRepository.deleteFromWaitingQueue(value);

      // WaitingQueue에서 새로 생성
      newQueue = await this.queueRedisRepository.createToWaitingQueue(
        queue.userId,
        queue.createdAt,
        newExpiredAt,
      );
    } else if (queue.status == QueueStatusEnum.WORKING) {
      // WorkingQueue에서 삭제
      await this.queueRedisRepository.deleteFromActiveQueue(value);

      // WorkingQueue에서 새로 생성
      newQueue = await this.queueRedisRepository.createToActiveQueue(
        queue.userId,
        newExpiredAt,
      );
    }

    return newQueue;
  }

  async processExpiredQueue(): Promise<void> {
    // TODO
    const now = new Date();

    // WaitingQueue에서 만료된 데이터 삭제
    const waitingQueues =
      await this.queueRedisRepository.findAllFromWaitingQueue();

    const expiredWaitingQueues = waitingQueues.filter((e) => {
      const expiredAt = Number(e.split(':')[2]);
      return expiredAt < now.getTime();
    });

    if (0 < expiredWaitingQueues.length) {
      await this.queueRedisRepository.deleteByArrayFromWaitingQueue(
        expiredWaitingQueues,
      );
    }

    // ActiveQueue에서 만료된 데이터 삭제
    const activeQueues =
      await this.queueRedisRepository.findAllFromActiveQueue();

    const expiredActiveQueues = activeQueues.filter((e) => {
      const expiredAt = Number(e.split(':')[2]);
      return expiredAt < now.getTime();
    });

    if (0 < expiredActiveQueues.length) {
      await this.queueRedisRepository.deleteByArrayFromActiveQueue(
        expiredActiveQueues,
      );
    }
  }

  async processQueue(): Promise<void> {
    // TODO
    // 100 - Active인 토큰 수 구하기
    const activeQueues = await this.queueRedisRepository.countAllFromActive();
    const leftSeat = 100 - activeQueues;

    if (leftSeat == 0) return;

    // WaitingQueue에서 해당하는 수만큼 pop
    const results =
      await this.queueRedisRepository.popFromWaitingQueue(leftSeat); // [member, score, member, score]
    const values = results.filter((_, i) => (i + 1) % 2 == 1);

    if (0 < values.length) {
      // ActiveQueue로 이동
      await this.queueRedisRepository.createToActiveQueueWithValue(values);
    }
  }

  async getWorking(args: QueueServiceGetWorkingProps): Promise<QueueModel> {
    const token = Buffer.from(args.token, 'base64').toString();
    const queue =
      await this.queueRedisRepository.findByPatternFromActiveQueue(token);

    if (!queue) {
      throw new NotFoundException('활성화된 토큰이 아닙니다.');
    }

    // 만료시간이 지났다면
    if (dayjs(queue.expiredAt).isBefore(dayjs())) {
      throw new ForbiddenException('이미 만료된 토큰입니다.');
    }

    return queue;
  }

  /**
   * 해당 토큰을 만료처리합니다.
   */
  async expire(queue: QueueModel) {
    const value = Buffer.from(queue.token, 'base64').toString();
    await this.queueRedisRepository.deleteFromActiveQueue(value);
  }
}
