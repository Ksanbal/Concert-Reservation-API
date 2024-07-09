import { IsNumber } from 'class-validator';

export class ReservationsCreateReqDto {
  @IsNumber()
  scheduleId: number;

  @IsNumber()
  seatId: number;
}
