import { InjectRepository } from '@nestjs/typeorm';
import { QueueEntity, QueueStatusEnum } from './entities/queue.entity';
import { EntityManager, LessThan, MoreThanOrEqual, Repository } from 'typeorm';
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

  async findByUserId(
    entityManager: EntityManager,
    userId: number,
  ): Promise<QueueModel> {
    const entity = await entityManager
      .createQueryBuilder(QueueEntity, 'queue')
      .setLock('pessimistic_write') // pessimistic_read(공유락), pessimistic_write(배타락)
      .where('queue.userId = :userId', { userId })
      .andWhere('queue.expiredAt >= :expiredAt', {
        expiredAt: new Date(),
      })
      .andWhere('queue.status != :status', {
        status: QueueStatusEnum.EXPIRED,
      })
      .getOne();

    return QueueModel.fromEntity(entity);
  }

  async findByToken(token: string): Promise<QueueModel> {
    return QueueModel.fromEntity(
      await this.queueRepository.findOne({ where: { token } }),
    );
  }

  async create(
    entityManager: EntityManager,
    args: QueueRepositoryCreateProps,
  ): Promise<QueueModel> {
    let entity = this.queueRepository.create(args);
    entity = await entityManager.save(entity);

    return QueueModel.fromEntity(entity);
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

  async delete(queue: QueueModel) {
    try {
      await this.queueRepository.delete(queue);
    } catch (error) {
      return false;
    }
  }
}
