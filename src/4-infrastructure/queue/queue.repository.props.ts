import { QueueStatusEnum } from './entities/queue.entity';

export type QueueRepositoryCreateProps = {
  userId: number;
  expiredAt: Date;
  status: QueueStatusEnum;
};
