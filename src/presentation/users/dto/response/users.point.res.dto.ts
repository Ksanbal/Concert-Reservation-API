import { IsNumber } from 'class-validator';

export class UsersPointResDto {
  @IsNumber()
  amount: number;

  constructor(args: UsersPointResProps) {
    Object.assign(this, args);
  }
}

type UsersPointResProps = {
  amount: number;
};
