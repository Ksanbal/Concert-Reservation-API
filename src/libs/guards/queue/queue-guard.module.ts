import { Global, Module } from '@nestjs/common';
import { QueueService } from 'src/3-domain/queue/queue.service';
import { QueueRepository } from 'src/4-infrastructure/queue/queue.repository';
import { QueueGuard } from './queue.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueEntity } from 'src/4-infrastructure/queue/entities/queue.entity';
import { QueueRedisRepository } from 'src/4-infrastructure/queue/queue-redis.repository';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([QueueEntity])],
  providers: [QueueService, QueueRepository, QueueGuard, QueueRedisRepository],
  exports: [QueueService, QueueRepository, QueueGuard, QueueRedisRepository],
})
export class QueueGuardModule {}
