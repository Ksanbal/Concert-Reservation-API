import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { v4 } from 'uuid';

export enum QueueStatusEnum {
  WAIT = 'wait',
  WORKING = 'working',
  EXPIRED = 'expired',
}

@Entity('queue')
export class QueueEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  expiredAt: Date;

  @Column()
  token: string;

  @Column()
  userId: number;

  @Column({
    enum: QueueStatusEnum,
  })
  status: QueueStatusEnum;

  @BeforeInsert()
  generateUUID() {
    this.token = v4(); // row가 생성될 때 token 필드에 UUID 값을 할당합니다.
  }
}
