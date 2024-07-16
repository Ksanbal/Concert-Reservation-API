import { QueueModel } from 'src/3-domain/queue/queue.model';
import { QueueStatusEnum } from 'src/4-infrastructure/queue/entities/queue.entity';
import { QueueRepositoryCreateProps } from 'src/4-infrastructure/queue/queue.repository.props';
import { v4 } from 'uuid';

export class QueueMockRepository {
  mockData: QueueModel[] = [
    new QueueModel({
      id: 1,
      expiredAt: new Date('2100-01-01T00:00:00Z'),
      token: 'expired-token',
      userId: 1,
      status: QueueStatusEnum.EXPIRED,
      remain: 0,
    }),
    new QueueModel({
      id: 2,
      expiredAt: new Date('2000-01-01T00:00:00Z'),
      token: 'remain-token',
      userId: 1,
      status: QueueStatusEnum.WORKING,
      remain: 0,
    }),
    new QueueModel({
      id: 3,
      expiredAt: new Date('2100-01-01T00:00:00Z'),
      token: 'working-token',
      userId: 2,
      status: QueueStatusEnum.WORKING,
      remain: 0,
    }),
    new QueueModel({
      id: 4,
      expiredAt: new Date('2100-01-01T00:00:00Z'),
      token: 'waiting-token',
      userId: 3,
      status: QueueStatusEnum.WAIT,
      remain: 1,
    }),
  ];

  findLastWorkingQueue = jest.fn(() => {
    return this.mockData.find(
      (queue) => queue.status === QueueStatusEnum.WORKING,
    );
  });

  findByUserId = jest.fn((userId: number) => {
    return this.mockData.find(
      (queue) =>
        queue.userId === userId &&
        new Date().getTime() <= queue.expiredAt.getTime() &&
        queue.status !== QueueStatusEnum.EXPIRED,
    );
  });

  findByToken = jest.fn((token: string) => {
    return this.mockData.find((queue) => queue.token === token);
  });
  create = jest.fn((args: QueueRepositoryCreateProps) => {
    const newQueue = new QueueModel({
      id: 4,
      expiredAt: args.expiredAt,
      token: v4(),
      userId: args.userId,
      status: args.status,
      remain: 0,
    });

    this.mockData.push(newQueue);

    return newQueue;
  });
  update = jest.fn((queue: QueueModel) => {
    return queue;
  });
  workingQueueCount = jest.fn(() => {
    return this.mockData.filter(
      (queue) => queue.status === QueueStatusEnum.WORKING,
    ).length;
  });
  findWaitingQueues = jest.fn((leftSpace: number) => {
    const data = this.mockData.filter(
      (queue) => queue.status === QueueStatusEnum.WAIT,
    );
    return data.slice(0, leftSpace);
  });
  bulkUpdate = jest.fn((queues: QueueModel[]) => {
    return queues.length;
  });
  findExpiredQueues = jest.fn(() => {
    return this.mockData.filter(
      (queue) => queue.status === QueueStatusEnum.EXPIRED,
    );
  });
}
