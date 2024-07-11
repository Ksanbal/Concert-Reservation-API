import {
  QueueEntity,
  QueueStatusEnum,
} from 'src/4-infrastructure/queue/entities/queue.entity';

export class QueueModel {
  id: number;
  expiredAt: Date;
  token: string;
  userId: number;
  status: QueueStatusEnum;
  remain: number;

  constructor(props: QueueModel) {
    this.id = props.id;
    this.expiredAt = props.expiredAt;
    this.token = props.token;
    this.userId = props.userId;
    this.status = props.status;
    this.remain = props.remain;
  }

  static fromEntity(entity: QueueEntity | null): QueueModel {
    if (entity == null) {
      return null;
    }

    return new QueueModel({
      id: entity.id,
      expiredAt: entity.expiredAt,
      token: entity.token,
      userId: entity.userId,
      status: entity.status,
      remain: 0,
    });
  }
}
