import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

export enum ConcertSeatStatusEnum {
  CLOSED = 'closed',
  OPEN = 'open',
  RESERVED = 'reserved',
  SOLDOUT = 'soldout',
}

@Entity('concert_seat')
@Index(['concertScheduleId'])
export class ConcertSeatEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  concertScheduleId: number;

  @Column()
  number: number;

  @Column()
  price: number;

  @Column({
    enum: ConcertSeatStatusEnum,
  })
  status: ConcertSeatStatusEnum;
}
