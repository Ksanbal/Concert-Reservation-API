import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('concert')
export class ConcertEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
