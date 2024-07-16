import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ReservationStatusEnum {
  RESERVED = 'reserved',
  EXPIRED = 'expired',
  PAID = 'paid',
}

@Entity('reservation')
export class ReservationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  expiredAt: Date;

  @Column()
  userId: number;

  @Column({
    enum: ReservationStatusEnum,
  })
  status: ReservationStatusEnum;

  @Column()
  concertMetaDataId: number;
}
