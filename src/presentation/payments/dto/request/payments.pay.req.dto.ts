import { IsNumber } from 'class-validator';

export class PaymentsPayReqDto {
  @IsNumber()
  reservationId: number;
}
