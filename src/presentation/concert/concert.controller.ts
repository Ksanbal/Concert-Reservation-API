import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ConcertPayReservationResponseDto,
  ConcertReservationRequestDto,
  ConcertReservationResponseDto,
  ConcertResponseDto,
  ConcertScheduleSeatResponseDto,
} from './concert.dto';

@Controller('concert')
export class ConcertController {
  @Get()
  async get(
    @Headers('Authorization') token: string,
  ): Promise<ConcertResponseDto[]> {
    const result = [
      {
        id: 1,
        name: '카리나의 왁자지껄',
        created_at: '2023-04-12T14:30:00+09:00',
        schedule: [
          {
            id: 1,
            date: '2023-04-12T14:30:00+09:00',
            left_seat: 50,
          },
        ],
      },
      {
        id: 2,
        name: '윈터의 와글와글',
        created_at: '2023-04-12T14:30:00+09:00',
        schedule: [
          {
            id: 2,
            date: '2023-04-12T14:30:00+09:00',
            left_seat: 50,
          },
          {
            id: 3,
            date: '2023-04-12T14:30:00+09:00',
            left_seat: 40,
          },
        ],
      },
    ];

    return result.map((r) => new ConcertResponseDto(r));
  }

  @Get('schedule/:scheduleId')
  async getSchedule(
    @Headers('Authorization') token: string,
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
  ): Promise<ConcertScheduleSeatResponseDto[]> {
    const result = [
      {
        id: 1,
        number: 1,
        price: 50000,
        status: 'Available', // Available, Reserved, Purchased
      },
      {
        id: 2,
        number: 2,
        price: 55000,
        status: 'Available', // Available, Reserved, Purchased
      },
      {
        id: 3,
        number: 1,
        price: 50000,
        status: 'Reserved', // Available, Reserved, Purchased
      },
      {
        id: 4,
        number: 1,
        price: 50000,
        status: 'Purchased', // Available, Reserved, Purchased
      },
    ];

    return result.map((r) => new ConcertScheduleSeatResponseDto(r));
  }

  @Post('schedule/reservation')
  async reservation(
    @Headers('Authorization') token: string,
    @Body() body: ConcertReservationRequestDto,
  ): Promise<ConcertReservationResponseDto> {
    return new ConcertReservationResponseDto({
      id: 1,
    });
  }

  @Patch('schedule/reservation/:reservationId')
  async payReservation(
    @Headers('Authorization') token: string,
    @Param('reservationId', ParseIntPipe) reservationId: number,
  ): Promise<ConcertPayReservationResponseDto> {
    return new ConcertReservationResponseDto({
      id: reservationId,
    });
  }
}
