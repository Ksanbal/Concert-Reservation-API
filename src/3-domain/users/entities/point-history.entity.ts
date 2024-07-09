import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum PointHistoryTypeEnum {
  CHARGE = 'charge',
  USE = 'use',
}

@Entity('point-history')
export class PointHistoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  userId: number;

  @Column()
  amount: number;

  @Column({
    enum: PointHistoryTypeEnum,
  })
  type: PointHistoryTypeEnum;
}
