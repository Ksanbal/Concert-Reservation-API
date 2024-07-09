import {
  IsDate,
  IsEnum,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ReservationStatusEnum } from '../enum/reservations.status.enum';
import { Type } from 'class-transformer';
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
