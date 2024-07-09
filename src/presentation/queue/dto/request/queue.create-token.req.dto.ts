import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class QueueCreateTokenReqDto {
  @ApiProperty({
    description: '사용자 ID',
  })
  @IsNumber()
  userId: number;
}
