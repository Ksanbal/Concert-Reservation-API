import { BadRequestException, Injectable } from '@nestjs/common';
import { ConcertsModel, ConcertSeatsModel } from './concerts.model';
import { ConcertsRepository } from 'src/4-infrastructure/concerts/concerts.repository';

@Injectable()
export class ConcertsService {
  constructor(private readonly repository: ConcertsRepository) {}

  // 유효한 공연 날짜 목록 조회
  async getList(): Promise<ConcertsModel[]> {
    return this.repository.findAllWhereOpen();
  }

  // 공연의 좌석 목록 조회
  async getSeats(concertScheduleId: number): Promise<ConcertSeatsModel[]> {
    const schedule = await this.repository.findScheduleById(concertScheduleId);

    if (schedule == null) {
      throw new BadRequestException('유효하지않은 공연입니다.');
    }

    return this.repository.findSeats(schedule.id);
  }
}
