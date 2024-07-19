import { IsEnum, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ConcertSeatsModel } from 'src/3-domain/concerts/concerts.model';
import { ConcertSeatStatusEnum } from 'src/4-infrastructure/concerts/entities/concert-seat.entity';

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

  static fromModel(model: ConcertSeatsModel) {
    return new ConcertsSeatsResDto({
      id: model.id,
      number: model.number,
      price: model.price,
      status: model.status,
    });
  }
}

type ConcertsSeatsResProps = {
  id: number;
  number: number;
  price: number;
  status: ConcertSeatStatusEnum;
};
