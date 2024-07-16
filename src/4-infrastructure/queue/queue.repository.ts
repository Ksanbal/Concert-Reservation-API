import { InjectRepository } from '@nestjs/typeorm';
import { QueueEntity, QueueStatusEnum } from './entities/queue.entity';
import { LessThan, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { QueueModel } from 'src/3-domain/queue/queue.model';
import { QueueRepositoryCreateProps } from './queue.repository.props';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QueueRepository {
  constructor(
    @InjectRepository(QueueEntity)
    private readonly queueRepository: Repository<QueueEntity>,
  ) {}

  async findLastWorkingQueue(): Promise<QueueModel> {
    return QueueModel.fromEntity(
      await this.queueRepository.findOne({
        where: {
          status: QueueStatusEnum.WORKING,
        },
        order: {
          id: 'DESC',
        },
      }),
    );
  }

  async findByUserId(userId: number): Promise<QueueModel> {
    return QueueModel.fromEntity(
      await this.queueRepository.findOne({
        where: {
          userId,
          expiredAt: MoreThanOrEqual(new Date()),
          status: Not(QueueStatusEnum.EXPIRED),
        },
      }),
    );
  }

  async findByToken(token: string): Promise<QueueModel> {
    return QueueModel.fromEntity(
      await this.queueRepository.findOne({ where: { token } }),
    );
  }

  async create(args: QueueRepositoryCreateProps): Promise<QueueModel> {
    const entity = this.queueRepository.create(args);

    return QueueModel.fromEntity(await this.queueRepository.save(entity));
  }

  async update(queue: QueueModel): Promise<QueueModel> {
    return QueueModel.fromEntity(await this.queueRepository.save(queue));
  }

  async workingQueueCount(): Promise<number> {
    return this.queueRepository.count({
      where: {
        status: QueueStatusEnum.WORKING,
        expiredAt: MoreThanOrEqual(new Date()),
      },
    });
  }

  async findWaitingQueues(leftSpace: number): Promise<QueueModel[]> {
    const entities = await this.queueRepository.find({
      where: {
        status: QueueStatusEnum.WAIT,
        expiredAt: MoreThanOrEqual(new Date()),
      },
      order: {
        id: 'ASC',
      },
      take: leftSpace,
    });

    return entities.map(QueueModel.fromEntity);
  }

  async bulkUpdate(queues: QueueModel[]): Promise<number> {
    const result = await this.queueRepository.save(queues);
    return result.length;
  }

  async findExpiredQueues(): Promise<QueueModel[]> {
    const entities = await this.queueRepository.find({
      where: {
        status: QueueStatusEnum.WAIT,
        expiredAt: LessThan(new Date()),
      },
    });

    return entities.map(QueueModel.fromEntity);
  }
}
