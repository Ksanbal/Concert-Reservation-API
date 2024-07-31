import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class QueueRedisRepository {
  constructor(
    @InjectRedis()
    private readonly redis: Redis,
  ) {}
}
