import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsService } from 'src/3-domain/reservations/reservations.service';
import { ReservationStatusEnum } from 'src/4-infrastructure/reservations/entities/reservation.entity';
import { ReservationsRepository } from 'src/4-infrastructure/reservations/reservations.repository';
import { ReservationsMockRepository } from 'test/4-infrastructure/reservations/reservations.mock-repository';

describe('ReservationsService', () => {
  let service: ReservationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReservationsService, ReservationsRepository],
    })
      .overrideProvider(ReservationsRepository)
      .useClass(ReservationsMockRepository)
      .compile();

    service = module.get<ReservationsService>(ReservationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('성공', async () => {
      // given
      const args = {
        userId: 2,
        concertMetaDataId: 1,
        expiredAt: new Date(),
        status: ReservationStatusEnum.RESERVED,
      };

      // when
      const result = await service.create(args);

      // then
      expect(result).toMatchObject({
        userId: args.userId,
        concertMetaData: {
          id: args.concertMetaDataId,
        },
        status: args.status,
      });
      expect(result.expiredAt.getTime()).toBeGreaterThanOrEqual(
        new Date().getTime(),
      );
    });
  });
});
