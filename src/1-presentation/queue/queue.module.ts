import { Module } from '@nestjs/common';
import { QueueController } from './queue.controller';
import { QueueFacade } from 'src/2-application/queue/queue.facade';
import { QueueService } from 'src/3-domain/queue/queue.service';
import { UsersService } from 'src/3-domain/users/users.service';
import { QueueRepository } from 'src/4-infrastructure/queue/queue.repository';
import { UsersRepository } from 'src/4-infrastructure/users/users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueEntity } from 'src/4-infrastructure/queue/entities/queue.entity';
import { UserEntity } from 'src/4-infrastructure/users/entities/user.entity';
import { PointEntity } from 'src/4-infrastructure/users/entities/point.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QueueEntity, UserEntity, PointEntity])],
  controllers: [QueueController],
  providers: [
    QueueFacade,
    QueueService,
    QueueRepository,
    UsersService,
    UsersRepository,
  ],
})
export class QueueModule {}
