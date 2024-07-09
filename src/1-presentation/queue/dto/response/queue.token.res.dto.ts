import { IsDate, IsEnum, IsNumber, IsUUID } from 'class-validator';
import { QueueTokenStatusEnum } from '../enum/queue.token-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class QueueTokenResDto {
  @ApiProperty({
    example: 'd07edb0f-3ac1-45a3-8972-7d263958b59d',
  })
  @IsUUID()
  token: string;

  @ApiProperty()
  @IsDate()
  expiredAt: Date;

  @ApiProperty()
  @IsEnum(QueueTokenStatusEnum)
  status: string;

  @ApiProperty()
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
