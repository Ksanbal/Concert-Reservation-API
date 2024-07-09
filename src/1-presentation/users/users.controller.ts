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
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  @ApiOperation({
    summary: '포인트 조회',
  })
  @ApiOkResponse({ type: UsersPointResDto })
  @Get(':userId/point')
  async getPoint(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<UsersPointResDto> {
    return new UsersPointResDto({
      amount: 1000,
    });
  }

  @ApiOperation({
    summary: '포인트 충전',
  })
  @Patch(':userId/point/charge')
  @ApiOkResponse({ type: UsersPointResDto })
  async chargePoint(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() req: UsersChargePointReqDto,
  ): Promise<UsersPointResDto> {
    return new UsersPointResDto({
      amount: 1000,
    });
  }
}
