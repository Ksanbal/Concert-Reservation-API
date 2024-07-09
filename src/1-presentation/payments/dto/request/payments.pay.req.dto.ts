import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class PaymentsPayReqDto {
  @ApiProperty()
  @IsNumber()
  reservationId: number;
}
