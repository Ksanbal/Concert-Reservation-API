import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum OutboxStatusEnum {
  INIT = 'init',
  PUBLISHED = 'published',
}

export class OutboxEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @Column({
    type: 'enum',
    enum: OutboxStatusEnum,
    default: OutboxStatusEnum.INIT,
  })
  status: OutboxStatusEnum;

  @Column()
  topic: string;

  @Column()
  key: string;

  @Column()
  value: string;
}
