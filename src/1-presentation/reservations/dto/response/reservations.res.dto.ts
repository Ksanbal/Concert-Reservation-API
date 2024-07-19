import {
  IsDate,
  IsEnum,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ReservationsModel } from 'src/3-domain/reservations/reservations.model';
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

export class ReservationsResDto {
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

  @ApiProperty({
    enum: ReservationStatusEnum,
  })
  @IsEnum(ReservationStatusEnum)
  status: ReservationStatusEnum;

  @ApiProperty({
    type: ConcertMetaData,
  })
  @ValidateNested()
  @Type(() => ConcertMetaData)
  concertMetaData: ConcertMetaData;

  constructor(args: ReservationResProps) {
    Object.assign(this, args);
  }

  static fromModel(model: ReservationsModel) {
    return new ReservationsResDto({
      id: model.id,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      expiredAt: model.expiredAt,
      status: model.status,
      concertMetaData: {
        concertName: model.concertMetaData.concertName,
        concertScheduleDate: model.concertMetaData.concertScheduleDate,
        concertSeatNumber: model.concertMetaData.concertSeatNumber,
        concertSeatPrice: model.concertMetaData.concertSeatPrice,
      },
    });
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
