import { Controller, Get, Headers, Param, ParseIntPipe } from '@nestjs/common';
import { ConcertsResDto } from './dto/response/concerts.res.dto';
import { ConcertsSeatsResDto } from './dto/response/concerts.seats.res.dto';
import { ConcertSeatStatusEnum } from './dto/enum/concert.seat-status.enum';

@Controller('concerts')
export class ConcertsController {
  @Get()
  async list(@Headers('Authorization') token: string) {
    const mockData = [
      {
        id: 1,
        name: '카리나의 왁자지껄',
        schedule: [
          {
            id: 1,
            date: new Date('2023-04-12T14:30:00+09:00'),
            ticketOpenAt: new Date('2023-04-12T14:30:00+09:00'),
            ticketCloseAt: new Date('2023-04-12T14:30:00+09:00'),
            leftSeat: 50,
          },
        ],
      },
      {
        id: 2,
        name: '윈터의 와글와글',
        schedule: [
          {
            id: 2,
            date: new Date('2023-04-12T14:30:00+09:00'),
            ticketOpenAt: new Date('2023-04-12T14:30:00+09:00'),
            ticketCloseAt: new Date('2023-04-12T14:30:00+09:00'),
            leftSeat: 50,
          },
          {
            id: 3,
            date: new Date('2023-04-12T14:30:00+09:00'),
            ticketOpenAt: new Date('2023-04-12T14:30:00+09:00'),
            ticketCloseAt: new Date('2023-04-12T14:30:00+09:00'),
            leftSeat: 50,
          },
        ],
      },
    ];

    return mockData.map((e) => new ConcertsResDto(e));
  }

  @Get('schedules/:scheduleId/seats')
  async seats(
    @Headers('Authorization') token: string,
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
  ) {
    const mockData = [
      {
        id: 1,
        number: 1,
        price: 10000,
        status: ConcertSeatStatusEnum.ABLE,
      },
      {
        id: 2,
        number: 2,
        price: 10000,
        status: ConcertSeatStatusEnum.ABLE,
      },
      {
        id: 4,
        number: 4,
        price: 10000,
        status: ConcertSeatStatusEnum.ABLE,
      },
    ];
    return mockData.map((e) => new ConcertsSeatsResDto(e));
  }
}
