import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PaymentsReservationStatusEnum } from '../enum/payments.reservation-status.enum';
import { ApiProperty } from '@nestjs/swagger';

class ConcertMetaData {
  @ApiProperty()
  @IsString()
  concertName: string;

  @ApiProperty()
  @IsDate()
  concertScheduleDate: Date;

  @ApiProperty()
  @IsNumber()
  concertSeatNumber: number;

  @ApiProperty()
  @IsNumber()
  concertSeatPrice: number;
}

class Reservation {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsDate()
  createdAt: Date;

  @ApiProperty()
  @IsDate()
  updatedAt: Date;

  @ApiProperty()
  @IsDate()
  expiredAt: Date;

  @ApiProperty({ enum: PaymentsReservationStatusEnum })
  @IsEnum(PaymentsReservationStatusEnum)
  status: PaymentsReservationStatusEnum;

  @ApiProperty()
  @ValidateNested()
  @Type(() => ConcertMetaData)
  concertMetaData: ConcertMetaData;
}

export class PaymentsPayResDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsDate()
  createdAt: Date;

  @ApiProperty({ type: Reservation })
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
