import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ReservationsCreateReqDto {
  @ApiProperty()
  @IsNumber()
  scheduleId: number;

  @ApiProperty()
  @IsNumber()
  seatId: number;
}
