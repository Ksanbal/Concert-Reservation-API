import { Injectable } from '@nestjs/common';
import { PaymentEntity } from './entities/payment.entity';
import { DataSource, EntityManager } from 'typeorm';
import {
  PaymentsRepositoryCreateDto,
  PaymentsRepositoryCreateOutboxDto,
} from './payments.repository-dto';
import { PaymentsModel } from 'src/3-domain/payments/payments.model';
import { PaymentOutboxEntity } from './entities/payment-outbox.entity';
import { OutboxStatusEnum } from 'src/libs/database/common/outbox.entity';

@Injectable()
export class PaymentsRepository {
  constructor(private readonly dataSource: DataSource) {}

  async create(
    entityManager: EntityManager,
    dto: PaymentsRepositoryCreateDto,
  ): Promise<PaymentsModel | null> {
    try {
      const payment = await entityManager.save(PaymentEntity, dto);

      return PaymentsModel.fromEntity(payment);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // id로 결제 정보 삭제
  async deleteById(entityManager: EntityManager, id: number) {
    await entityManager.delete(PaymentEntity, id);
  }

  // 결제 outbox 생성
  async createdOutbox(
    entityManager: EntityManager,
    dto: PaymentsRepositoryCreateOutboxDto,
  ) {
    await entityManager.save(PaymentOutboxEntity, dto);
  }

  // 결제 outbox 업데이트
  async updateOutboxByPaymentId(paymentId: number, status: OutboxStatusEnum) {
    await this.dataSource
      .createQueryBuilder()
      .update(PaymentOutboxEntity)
      .where('paymentId = :paymentId', { paymentId })
      .andWhere('status = :status', { status: OutboxStatusEnum.INIT })
      .set({ status })
      .execute();
  }

  // 미발행 outbox 조회
  async findAllUnpublishedOutboxs(
    before: Date,
  ): Promise<PaymentOutboxEntity[]> {
    return this.dataSource
      .getRepository(PaymentOutboxEntity)
      .createQueryBuilder('outbox')
      .where('outbox.status = :status', { status: OutboxStatusEnum.INIT })
      .andWhere('outbox.updatedAt < :before', { before })
      .getMany();
  }
}
