import { IsNumber } from 'class-validator';

export class QueueCreateTokenReqDto {
  @IsNumber()
  userId: number;
}
