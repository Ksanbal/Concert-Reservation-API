import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PaymentsReservationStatusEnum } from '../enum/payments.reservation-status.enum';

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

class Reservation {
  @IsNumber()
  id: number;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsDate()
  expiredAt: Date;

  @IsEnum(PaymentsReservationStatusEnum)
  status: PaymentsReservationStatusEnum;

  @ValidateNested()
  @Type(() => ConcertMetaData)
  concertMetaData: ConcertMetaData;
}

export class PaymentsPayResDto {
  @IsNumber()
  id: number;

  @IsDate()
  createdAt: Date;

  @ValidateNested()
  @Type(() => Reservation)
  reservation: Reservation;

  constructor(args: PaymentsPayResProps) {
    Object.assign(this, args);
  }
}

type ConcertMetaDataProps = {
  concertName: string;
  concertScheduleDate: Date;
  concertSeatNumber: number;
  concertSeatPrice: number;
};

type ReservationProps = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  expiredAt: Date;
  status: PaymentsReservationStatusEnum;
  concertMetaData: ConcertMetaDataProps;
};

type PaymentsPayResProps = {
  id: number;
  createdAt: Date;
  reservation: ReservationProps;
};
