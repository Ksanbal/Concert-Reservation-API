import {
  IsDate,
  IsEnum,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ReservationStatusEnum } from '../enum/reservations.status.enum';
import { Type } from 'class-transformer';

class ConcertMetaData {
  @IsString()
  concertName: string;

  @IsDate()
  concertScheduleDate: Date;

  @IsNumber()
  concertSeatNumber: number;

  @IsNumber()
  concertSeatPrice: number;
}

export class ReservationsResDto {
  @IsNumber()
  id: number;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsDate()
  expiredAt: Date;

  @IsEnum(ReservationStatusEnum)
  status: ReservationStatusEnum;

  @ValidateNested()
  @Type(() => ConcertMetaData)
  concertMetaData: ConcertMetaData;

  constructor(args: ReservationResProps) {
    Object.assign(this, args);
  }
}

type ConcertMetaDataProps = {
  concertName: string;
  concertScheduleDate: Date;
  concertSeatNumber: number;
  concertSeatPrice: number;
};

type ReservationResProps = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  expiredAt: Date;
  status: ReservationStatusEnum;
  concertMetaData: ConcertMetaDataProps;
};
