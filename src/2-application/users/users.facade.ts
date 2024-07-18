import { ConflictException, Injectable } from '@nestjs/common';
import { UsersChargePointReqDto } from 'src/1-presentation/users/dto/request/users.charge-point.req.dto';
import { UsersService } from 'src/3-domain/users/users.service';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersFacade {
  constructor(
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * 포인트 조회
   */
  async getPoint(userId: number) {
    return await this.usersService.getPoint(userId);
  }

  /**
   * 포인트 충전
   */
  async chargePoint(userId: number, req: UsersChargePointReqDto) {
    return await this.dataSource
      .transaction(async (entityManage) => {
        return await this.usersService.chargePoint(
          entityManage,
          userId,
          req.amount,
        );
      })
      .catch((error) => {
        {
          throw new ConflictException(error);
        }
      });
  }
}
