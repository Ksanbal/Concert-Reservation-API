import { Module } from '@nestjs/common';
import { QueueController } from './controller/queue.controller';
import { QueueFacade } from 'src/2-application/queue/queue.facade';
import { QueueService } from 'src/3-domain/queue/queue.service';
import { UsersService } from 'src/3-domain/users/users.service';
import { QueueRepository } from 'src/4-infrastructure/queue/queue.repository';
import { UsersRepository } from 'src/4-infrastructure/users/users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueEntity } from 'src/4-infrastructure/queue/entities/queue.entity';
import { UserEntity } from 'src/4-infrastructure/users/entities/user.entity';
import { PointEntity } from 'src/4-infrastructure/users/entities/point.entity';
import { QueueRedisRepository } from 'src/4-infrastructure/queue/queue-redis.repository';
import { QueueScheduler } from './scheduler/queue.scheduler';

@Module({
  imports: [TypeOrmModule.forFeature([QueueEntity, UserEntity, PointEntity])],
  controllers: [QueueController],
  providers: [
    QueueScheduler,
    QueueFacade,
    QueueService,
    QueueRepository,
    QueueRedisRepository,
    UsersService,
    UsersRepository,
  ],
})
export class QueueModule {}
