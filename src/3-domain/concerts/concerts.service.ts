import { BadRequestException, Injectable } from '@nestjs/common';
import {
  ConcertsModel,
  ConcertSeatsModel,
  ConcertMetaDataModel,
} from './concerts.model';
import { ConcertsRepository } from 'src/4-infrastructure/concerts/concerts.repository';
import { ConcertSeatStatusEnum } from 'src/4-infrastructure/concerts/entities/concert-seat.entity';
import { DataSource, EntityManager } from 'typeorm';

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
    await this.dataSource.createEntityManager().transaction(async (manager) => {
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

      // 스케줄 예약 수 감소 업데이트
      const schedule = await this.repository.findScheduleByIdWithTransaction(
        manager,
        seat.concertScheduleId,
      );

      schedule.leftSeat -= 1;

      await this.repository.updateScheduleLeftSeatWithTransaction(
        manager,
        schedule.id,
        schedule.leftSeat,
      );
    });
  }

  // 공연 meta data 생성
  async createMetaData(
    scheduleId: number,
    seatId: number,
  ): Promise<ConcertMetaDataModel> {
    // 공연 스케줄 조회
    const concertSchedule = await this.repository.findScheduleById(scheduleId);

    // 공연 조회
    const concert = await this.repository.findById(concertSchedule.concertId);

    // 공연 좌석 조회
    const concertSeat = await this.repository.findSeatById(seatId);

    // 공연 메타 데이터 생성
    return this.repository.createMetaData({
      concert,
      concertSchedule,
      concertSeat,
    });
  }

  // 좌석 예약 반환 & 공연 meta data 삭제
  async rollbackReserved(
    entityManager: EntityManager,
    concertMetaDatas: ConcertMetaDataModel[],
  ) {
    const seatIds = [];
    const concertMetaDataIds = [];
    concertMetaDatas.forEach((e) => {
      seatIds.push(e.concertSeatId);
      concertMetaDataIds.push(e.id);
    });

    const seatReuslt = await this.repository.updateReservedSeatsToOpen(
      entityManager,
      seatIds,
    );
    if (seatReuslt == false) {
      throw new Error('좌석 상태 변경 실패');
    }

    const metaResult = await this.repository.deleteConcertMetaData(
      entityManager,
      concertMetaDataIds,
    );

    if (metaResult == false) {
      throw new Error('공연 메타데이터 삭제 실패');
    }
  }

  // 예약 좌석의 상태를 결제로 변경
  async paySeat(entityManager: EntityManager, seatId: number) {
    const result = await this.repository.updateSeatStatusById(
      entityManager,
      seatId,
      ConcertSeatStatusEnum.SOLDOUT,
    );

    if (result == false) {
      throw new Error('좌석 결제처리 실패');
    }
  }
}
