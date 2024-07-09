import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { UsersChargePointReqDto } from './dto/request/users.charge-point.req.dto';
import { UsersPointResDto } from './dto/response/users.point.res.dto';

@Controller('users')
export class UsersController {
  @Get(':userId/point')
  async getPoint(@Param('userId', ParseIntPipe) userId: number) {
    return new UsersPointResDto({
      amount: 1000,
    });
  }

  @Patch(':userId/point/charge')
  async chargePoint(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() req: UsersChargePointReqDto,
  ) {
    return new UsersPointResDto({
      amount: 1000,
    });
  }
}
