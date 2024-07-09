import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

class Schedule {
  @IsNumber()
  id: number;

  @IsDate()
  date: Date;

  @IsDate()
  ticketOpenAt: Date;

  @IsDate()
  ticketCloseAt: Date;

  @IsNumber()
  leftSeat: number;
}

export class ConcertsResDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Schedule)
  schedule: Schedule[];

  constructor(args: ConcertsResProps) {
    Object.assign(this, args);
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
