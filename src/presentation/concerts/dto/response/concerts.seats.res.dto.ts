import { IsEnum, IsNumber } from 'class-validator';
import { ConcertSeatStatusEnum } from '../enum/concert.seat-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class ConcertsSeatsResDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNumber()
  number: number;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty({ enum: ConcertSeatStatusEnum })
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
