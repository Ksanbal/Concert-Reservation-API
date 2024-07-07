import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { PointResponseDto, PointChargeRequestDto } from './point.dto';

@Controller('point')
export class PointController {
  @Get(':userId')
  async get(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<PointResponseDto> {
    return new PointResponseDto({
      amount: 100000,
    });
  }

  @Patch(':userId')
  async charge(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: PointChargeRequestDto,
  ) {
    return;
  }
}
