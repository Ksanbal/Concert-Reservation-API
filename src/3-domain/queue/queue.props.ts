import { QueueModel } from './queue.model';

export type QueueServiceCreateProps = {
  userId: number;
};

export type QueueServiceGetProps = {
  queue: QueueModel;
};

export type QueueServiceGetWorkingProps = {
  token: string;
};
