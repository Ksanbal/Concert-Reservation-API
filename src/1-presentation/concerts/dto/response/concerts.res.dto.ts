import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  ConcertScheduleModel,
  ConcertsModel,
} from 'src/3-domain/concerts/concerts.model';

class Schedule {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsDate()
  date: Date;

  @ApiProperty()
  @IsDate()
  ticketOpenAt: Date;

  @ApiProperty()
  @IsDate()
  ticketCloseAt: Date;

  @ApiProperty()
  @IsNumber()
  leftSeat: number;

  constructor(args: ScheduleProps) {
    Object.assign(this, args);
  }

  static fromModel(model: ConcertScheduleModel) {
    return new Schedule({
      id: model.id,
      date: model.date,
      ticketOpenAt: model.ticketOpenAt,
      ticketCloseAt: model.ticketCloseAt,
      leftSeat: model.leftSeat,
    });
  }
}

export class ConcertsResDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ type: [Schedule] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Schedule)
  schedule: Schedule[];

  constructor(args: ConcertsResProps) {
    Object.assign(this, args);
  }

  static fromModel(model: ConcertsModel) {
    return new ConcertsResDto({
      id: model.id,
      name: model.name,
      schedule: model.schedules.map(Schedule.fromModel),
    });
  }
}

type ScheduleProps = {
  id: number;
  date: Date;
  ticketOpenAt: Date;
  ticketCloseAt: Date;
  leftSeat: number;
};

type ConcertsResProps = {
  id: number;
  name: string;
  schedule: ScheduleProps[];
};
