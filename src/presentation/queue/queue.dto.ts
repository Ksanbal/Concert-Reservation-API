import { IsEnum, IsNumber, IsUUID } from 'class-validator';

/**
 * Request
 */

/**
 * Response
 */
export class QueueResponseDto {
  @IsUUID()
  token: string;

  @IsEnum(['wait', 'working'])
  status: string;

  @IsNumber()
  remain: number;

  constructor(args: QueueResponseProps) {
    Object.assign(this, args);
  }
}

type QueueResponseProps = {
  token: string;
  status: string;
  remain: number;
};
