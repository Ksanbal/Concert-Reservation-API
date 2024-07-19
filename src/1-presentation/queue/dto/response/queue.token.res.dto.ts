import { IsDate, IsEnum, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { QueueStatusEnum } from 'src/4-infrastructure/queue/entities/queue.entity';

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
  @IsEnum(QueueStatusEnum)
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
  status: QueueStatusEnum;
  remain: number;
};
