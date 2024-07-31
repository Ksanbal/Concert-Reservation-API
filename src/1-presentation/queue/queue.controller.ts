import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { QueueCreateTokenReqDto } from './dto/request/queue.create-token.req.dto';
import { QueueTokenResDto } from './dto/response/queue.token.res.dto';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { QueueFacade } from 'src/2-application/queue/queue.facade';
import { QueueGuard } from 'src/libs/guards/queue/queue.guard';
import { CurrentQueue } from 'src/libs/decorators/current-queue/current-queue.decorator';
import { QueueModel } from 'src/3-domain/queue/queue.model';

@ApiTags('Queue')
@Controller('queue')
export class QueueController {
  constructor(private readonly queueFacade: QueueFacade) {}

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
    const result = await this.queueFacade.create(body);
    return result;
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
  @UseGuards(QueueGuard)
  async extend(@CurrentQueue() queue: QueueModel): Promise<QueueTokenResDto> {
    const result = await this.queueFacade.extend({ queue });
    return result;
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
  @UseGuards(QueueGuard)
  async validateToken(
    @CurrentQueue() queue: QueueModel,
  ): Promise<QueueTokenResDto> {
    const result = await this.queueFacade.get({ queue });
    return result;
  }
}
