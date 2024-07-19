import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentsModel } from 'src/3-domain/payments/payments.model';
import { ReservationStatusEnum } from 'src/4-infrastructure/reservations/entities/reservation.entity';

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

  @ApiProperty({ enum: ReservationStatusEnum })
  @IsEnum(ReservationStatusEnum)
  status: ReservationStatusEnum;

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

  @ApiProperty()
  @IsNumber()
  reservationId: number;

  @ApiProperty()
  @IsNumber()
  userId: number;

  // @ApiProperty({ type: Reservation })
  // @ValidateNested()
  // @Type(() => Reservation)
  // reservation: Reservation;

  constructor(args: PaymentsPayResProps) {
    Object.assign(this, args);
  }

  static fromModel(model: PaymentsModel) {
    return new PaymentsPayResDto({
      id: model.id,
      createdAt: model.createdAt,
      reservationId: model.reservationId,
      userId: model.userId,
    });
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
  status: ReservationStatusEnum;
  concertMetaData: ConcertMetaDataProps;
};

type PaymentsPayResProps = {
  id: number;
  createdAt: Date;
  // reservation: ReservationProps;
  reservationId: number;
  userId: number;
};
