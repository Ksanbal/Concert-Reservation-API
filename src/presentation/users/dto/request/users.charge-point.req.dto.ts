import { IsNumber } from 'class-validator';

export class UsersChargePointReqDto {
  @IsNumber()
  amount;
}
