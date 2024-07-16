import { BadRequestException, Injectable } from '@nestjs/common';
import {
  ConcertsModel,
  ConcertSeatsModel,
  ConcertMetaDataModel,
} from './concerts.model';
import { ConcertsRepository } from 'src/4-infrastructure/concerts/concerts.repository';
import { ConcertSeatStatusEnum } from 'src/4-infrastructure/concerts/entities/concert-seat.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class ConcertsService {
  constructor(
    private readonly repository: ConcertsRepository,
    private readonly dataSource: DataSource,
  ) {}

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

  // 좌석 예약처리 요청
  async reserveSeat(seatId: number) {
    // 좌석 상태 조회 및 검증 후 업데이트
    const seat = await this.dataSource
      .createEntityManager()
      .transaction(async (manager) => {
        // 좌석 조회
        const seat = await this.repository.findSeatByIdWithTransaction(
          manager,
          seatId,
        );

        if (seat.status !== ConcertSeatStatusEnum.OPEN) {
          throw new BadRequestException(
            '유효하지 않거나 이미 선택된 좌석입니다.',
          );
        }

        // 좌석 상태 업데이트
        seat.status = ConcertSeatStatusEnum.RESERVED;

        await this.repository.updateSeatStatus(manager, seat);

        return seat;
      });

    // 스케줄 예약 수 감소 업데이트
    const schedule = await this.repository.findScheduleById(
      seat.concertScheduleId,
    );

    schedule.leftSeat -= 1;

    await this.repository.updateScheduleLeftSeat(
      schedule.id,
      schedule.leftSeat,
    );
  }

  // 공연 meta data 생성
  async createMetaData(scheduleId: number): Promise<ConcertMetaDataModel> {
    // 공연 스케줄 조회
    const concertSchedule = await this.repository.findScheduleById(scheduleId);

    // 공연 조회
    const concert = await this.repository.findById(concertSchedule.id);

    // 공연 좌석 조회
    const concertSeat = await this.repository.findSeatById(concertSchedule.id);

    // 공연 메타 데이터 생성
    return this.repository.createMetaData({
      concert,
      concertSchedule,
      concertSeat,
    });
  }

  // 좌석 예약 반환
  async rollbackSeat(seatId: number) {
    // TODO status가 reserved인 seatId의 상태를 open으로 변경
    const result = await this.repository.updateReservedSeatToOpen(seatId);
    if (result == false) {
      throw new Error('좌석 상태 변경 실패');
    }
  }

  // 공연 meta data 삭제
  async deleteMetaData(concertMetaDataId: number) {
    // TODO 해당 id의 콘서트 메타 데이터를 삭제
    const result =
      await this.repository.deleteConcertMetaData(concertMetaDataId);
    if (result == false) {
      throw new Error('콘서트 메타 데이터 삭제 실패');
    }
  }
}
