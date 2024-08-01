import {
  QueueEntity,
  QueueStatusEnum,
} from 'src/4-infrastructure/queue/entities/queue.entity';

export class QueueModel {
  token: string;
  userId: number;
  expiredAt: Date;
  status: QueueStatusEnum;
  remain: number;
  createdAt: Date;

  constructor(props: QueueModel) {
    this.token = props.token;
    this.userId = props.userId;
    this.expiredAt = props.expiredAt;
    this.status = props.status;
    this.remain = props.remain;
    this.createdAt = props.createdAt;
  }

  static fromEntity(entity: QueueEntity | null): QueueModel {
    if (entity == null) {
      return null;
    }

    return new QueueModel({
      token: entity.token,
      userId: entity.userId,
      expiredAt: entity.expiredAt,
      status: entity.status,
      remain: 0,
      createdAt: null,
    });
  }

  static fromRedisValue(
    value: string,
    status: QueueStatusEnum,
    score: string | null,
  ): QueueModel {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, userId, expiredAt] = value.split(':');

    return new QueueModel({
      token: Buffer.from(value).toString('base64'),
      userId: Number(userId),
      expiredAt: new Date(Number(expiredAt)),
      status,
      remain: 0,
      createdAt: score != null ? new Date(Number(score)) : null,
    });
  }
}
