import { Body, Controller, Get, Post, Put, Headers } from '@nestjs/common';
import { QueueCreateTokenReqDto } from './dto/request/queue.create-token.req.dto';
import { QueueTokenResDto } from './dto/response/queue.token.res.dto';
import { QueueTokenStatusEnum } from './dto/enum/queue.token-status.enum';

@Controller('queue')
export class QueueController {
  // 대기열 토큰 발급
  @Post('token')
  async create(
    @Body() body: QueueCreateTokenReqDto,
  ): Promise<QueueTokenResDto> {
    return new QueueTokenResDto({
      token: 'd07edb0f-3ac1-45a3-8972-7d263958b59d',
      expiredAt: new Date('2024-12-31'),
      status: QueueTokenStatusEnum.WAIT,
      remain: 1,
    });
  }

  // 대기열 토큰 유효기간 연장
  @Put('token')
  async extend(
    @Headers('authorization') token: string,
  ): Promise<QueueTokenResDto> {
    return new QueueTokenResDto({
      token: token,
      expiredAt: new Date('2024-12-31'),
      status: QueueTokenStatusEnum.WAIT,
      remain: 1,
    });
  }

  // 대기열 토큰 유효성 체크
  @Get('token/validate')
  async validateToken(
    @Headers('authorization') token: string,
  ): Promise<QueueTokenResDto> {
    return new QueueTokenResDto({
      token: token,
      expiredAt: new Date('2024-12-31'),
      status: QueueTokenStatusEnum.WAIT,
      remain: 1,
    });
  }
}
