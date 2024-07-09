import { IsEnum, IsNumber } from 'class-validator';
import { ConcertSeatStatusEnum } from '../enum/concert.seat-status.enum';

export class ConcertsSeatsResDto {
  @IsNumber()
  id: number;

  @IsNumber()
  number: number;

  @IsNumber()
  price: number;

  @IsEnum(ConcertSeatStatusEnum)
  status: ConcertSeatStatusEnum;

  constructor(args: ConcertsSeatsResProps) {
    Object.assign(this, args);
  }
}

type ConcertsSeatsResProps = {
  id: number;
  number: number;
  price: number;
  status: ConcertSeatStatusEnum;
};
