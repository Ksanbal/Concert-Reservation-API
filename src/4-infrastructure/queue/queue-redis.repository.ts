import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { QueueModel } from 'src/3-domain/queue/queue.model';
import { v4 } from 'uuid';
import { QueueStatusEnum } from './entities/queue.entity';

@Injectable()
export class QueueRedisRepository {
  constructor(
    @InjectRedis()
    private readonly redis: Redis,
  ) {}

  /**
   * ActiveQueue에서 pattern으로 queue 조회 (SSCAN)
   * @param pattern
   * @returns
   */
  async findByPatternFromActiveQueue(
    pattern: string,
  ): Promise<QueueModel | null> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, [value]] = await this.redis.sscan(
      'ActiveQueue',
      0,
      'MATCH',
      pattern,
    );
    if (value) {
      return QueueModel.fromRedisValue(value, QueueStatusEnum.WORKING, null);
    }

    return null;
  }

  /**
   * ActiveQueue에서 value로 queue 조회 (SISMEMBER)
   * @param value
   * @returns
   */
  async existByValueFromActiveQueue(value: string): Promise<boolean> {
    const isExist = await this.redis.sismember('ActiveQueue', value);

    return isExist == 1;
  }

  // WaitingQueue에서 queue 조회
  async findByPatternFromWaitingQueue(pattern: string): Promise<QueueModel> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, [value, score]] = await this.redis.zscan(
      'WaitingQueue',
      0,
      'MATCH',
      pattern,
    );

    if (value) {
      const queue = QueueModel.fromRedisValue(
        value,
        QueueStatusEnum.WAIT,
        score,
      );

      return queue;
    }

    return null;
  }

  // WaitingQueue에서 현재 순위 조회
  async getRankByValueFromWaitingQueue(value: string): Promise<number> {
    const rank = await this.redis.zrank('WaitingQueue', value);

    return rank;
  }

  // 해당 userId의 queue를 생성
  async createToWaitingQueue(
    userId: number,
    score: Date,
    expiredAt: Date,
  ): Promise<QueueModel> {
    // uuid:userId:expiredAt
    const value = `${v4()}:${userId}:${expiredAt.getTime()}`;
    await this.redis.zadd('WaitingQueue', score.getTime(), value);

    return QueueModel.fromRedisValue(
      value,
      QueueStatusEnum.WAIT,
      score.getTime().toString(),
    );
  }

  // 해당 userId의 queue를 생성
  async createToActiveQueue(
    userId: number,
    expiredAt: Date,
  ): Promise<QueueModel> {
    // uuid:userId:expiredAt
    const value = `${v4()}:${userId}:${expiredAt.getTime()}`;
    await this.redis.sadd('ActiveQueue', value);

    return QueueModel.fromRedisValue(value, QueueStatusEnum.WORKING, null);
  }

  // WaitingQueue에서 삭제
  async deleteFromWaitingQueue(value: string) {
    await this.redis.zrem('WaitingQueue', value);
  }

  // WaitingQueue에서 리스트로 삭제
  async deleteByArrayFromWaitingQueue(value: string[]) {
    await this.redis.zrem('WaitingQueue', value);
  }

  // ActiveQueue에서 삭제
  async deleteFromActiveQueue(value: string) {
    await this.redis.srem('ActiveQueue', value);
  }

  // ActiveQueue에서 리스트로 삭제
  async deleteByArrayFromActiveQueue(value: string[]) {
    await this.redis.srem('ActiveQueue', value);
  }

  // WaitingQueue에서 전체 가져오기
  async findAllFromWaitingQueue(): Promise<string[]> {
    return await this.redis.zrange('WaitingQueue', 0, -1);
  }

  // ActiveQueue에서 전체 가져오기
  async findAllFromActiveQueue(): Promise<string[]> {
    return await this.redis.smembers('ActiveQueue');
  }

  // ActiveQueue의 수 구하기
  async countAllFromActive(): Promise<number> {
    return await this.redis.scard('ActiveQueue');
  }

  // WaitingQueue에서 zpopmin 실행
  async popFromWaitingQueue(count: number): Promise<string[]> {
    return await this.redis.zpopmin('WaitingQueue', count);
  }

  // value 목록으로 생성
  async createToActiveQueueWithValue(values: string[]) {
    await this.redis.sadd('ActiveQueue', values);
  }
}
