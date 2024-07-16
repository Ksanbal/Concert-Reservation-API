import { Injectable } from '@nestjs/common';
import { ConcertsServiceGetSeatsProps } from 'src/3-domain/concerts/concerts.props';
import { ConcertsService } from 'src/3-domain/concerts/concerts.service';
import { QueueService } from 'src/3-domain/queue/queue.service';

@Injectable()
export class ConcertsFacade {
  constructor(
    private readonly queueService: QueueService,
    private readonly concertsService: ConcertsService,
  ) {}

  /**
   * 예약 가능한 공연 날짜 조회
   */
  async getAvailableDates(token: string) {
    // 토큰 유효성 검사 및 userId 조회
    await this.queueService.getWorking({ token });

    // 유효한 공연 날짜 정보 조회
    return this.concertsService.getList();
  }

  /**
   * 공연 좌석 조회
   */
  async getSeats(token: string, args: ConcertsServiceGetSeatsProps) {
    // 토큰 유효성 검사 및 userId 조회
    await this.queueService.getWorking({ token });

    // 공연의 좌석 목록 조회
    return this.concertsService.getSeats(args.concertScheduleId);
  }
}
