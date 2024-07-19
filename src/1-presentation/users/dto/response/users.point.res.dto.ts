import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { PointModel } from 'src/3-domain/users/users.model';

export class UsersPointResDto {
  @ApiProperty()
  @IsNumber()
  amount: number;

  constructor(args: UsersPointResProps) {
    Object.assign(this, args);
  }

  static fromModel(model: PointModel) {
    return new UsersPointResDto({
      amount: model.amount,
    });
  }
}

type UsersPointResProps = {
  amount: number;
};
