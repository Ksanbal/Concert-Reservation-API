import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

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
