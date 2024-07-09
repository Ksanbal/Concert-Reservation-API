import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UsersPointResDto {
  @ApiProperty()
  @IsNumber()
  amount: number;

  constructor(args: UsersPointResProps) {
    Object.assign(this, args);
  }
}

type UsersPointResProps = {
  amount: number;
};
