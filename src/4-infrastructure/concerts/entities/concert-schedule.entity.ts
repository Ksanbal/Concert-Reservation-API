import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('concert_schedule')
@Index(['ticketOpenAt', 'ticketCloseAt'])
export class ConcertScheduleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  concertId: number;

  @Column()
  date: Date;

  @Column()
  ticketOpenAt: Date;

  @Column()
  ticketCloseAt: Date;

  @Column()
  leftSeat: number;
}
