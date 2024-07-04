import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { PointResponseDto, PointUpdateRequestDto } from './point.dto';

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
  async update(@Body() body: PointUpdateRequestDto) {
    return;
  }
}
