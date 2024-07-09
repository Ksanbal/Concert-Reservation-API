import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('concert-meta-data')
export class ConcertMetaDataEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  concertId: number;

  @Column()
  concertName: string;

  @Column()
  concertScheduleId: number;

  @Column()
  concertScheduleDate: Date;

  @Column()
  concertSeatId: number;

  @Column()
  concertSeatPrice: number;
}
