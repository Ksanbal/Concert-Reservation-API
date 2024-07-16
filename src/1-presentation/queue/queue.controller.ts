import { Body, Controller, Get, Post, Put, Headers } from '@nestjs/common';
import { QueueCreateTokenReqDto } from './dto/request/queue.create-token.req.dto';
import { QueueTokenResDto } from './dto/response/queue.token.res.dto';
import { QueueTokenStatusEnum } from './dto/enum/queue.token-status.enum';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Queue')
@Controller('queue')
export class QueueController {
  // 대기열 토큰 발급
  @ApiOperation({
    summary: '대기열 토큰 발급',
  })
  @ApiOkResponse({ type: QueueTokenResDto })
  @ApiUnauthorizedResponse({
    example: {
      message: '유효하지 않은 사용자입니다.',
    },
  })
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
  @ApiOperation({
    summary: '대기열 토큰 유효기간 연장',
  })
  @ApiOkResponse({ type: QueueTokenResDto })
  @ApiUnauthorizedResponse({
    example: {
      message: '이미 만료된 토큰입니다.',
    },
  })
  @ApiNotFoundResponse({
    example: {
      message: '토큰을 존재하지 않습니다.',
    },
  })
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
  @ApiOperation({
    summary: '대기열 토큰 유효성 체크',
  })
  @ApiOkResponse({ type: QueueTokenResDto })
  @ApiUnauthorizedResponse({
    example: {
      message: '이미 만료된 토큰입니다.',
    },
  })
  @ApiNotFoundResponse({
    example: {
      message: '토큰을 존재하지 않습니다.',
    },
  })
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
