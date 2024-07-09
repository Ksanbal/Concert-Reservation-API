import { IsDate, IsEnum, IsNumber, IsUUID } from 'class-validator';
import { QueueTokenStatusEnum } from '../enum/queue.token-status.enum';

export class QueueTokenResDto {
  @IsUUID()
  token: string;

  @IsDate()
  expiredAt: Date;

  @IsEnum(QueueTokenStatusEnum)
  status: string;

  @IsNumber()
  remain: number;

  constructor(args: QueueTokenResProps) {
    Object.assign(this, args);
  }
}

type QueueTokenResProps = {
  token: string;
  expiredAt: Date;
  status: QueueTokenStatusEnum;
  remain: number;
};
