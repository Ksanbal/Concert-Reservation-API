import { IsNumber } from 'class-validator';

/**
 * Request
 */
export class PointUpdateRequestDto {
  @IsNumber()
  amount: number;
}

/**
 * Response
 */
export class PointResponseDto {
  @IsNumber()
  amount: number;

  constructor(args: PointResponseProps) {
    Object.assign(this, args);
  }
}

type PointResponseProps = {
  amount: number;
};
