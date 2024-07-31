import { Injectable } from '@nestjs/common';
import { ConcertsServiceGetSeatsProps } from 'src/3-domain/concerts/concerts.props';
import { ConcertsService } from 'src/3-domain/concerts/concerts.service';

@Injectable()
export class ConcertsFacade {
  constructor(private readonly concertsService: ConcertsService) {}

  /**
   * 예약 가능한 공연 날짜 조회
   */
  async getAvailableDates() {
    // 유효한 공연 날짜 정보 조회
    return this.concertsService.getList();
  }

  /**
   * 공연 좌석 조회
   */
  async getSeats(args: ConcertsServiceGetSeatsProps) {
    // 공연의 좌석 목록 조회
    return this.concertsService.getSeats(args.concertScheduleId);
  }
}
