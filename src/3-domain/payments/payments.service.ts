import { ConflictException, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { PaymentsModel } from './payments.model';
import { PaymentsRepository } from 'src/4-infrastructure/payments/payments.repository';
import { PaymentsServiceCreateOutboxDto } from './dto/payments.service.dto';
import { PaymentsPaiedEvenDto } from 'src/events/payments/dto/payments.event.dto';
import { OutboxStatusEnum } from 'src/libs/database/common/outbox.entity';

@Injectable()
export class PaymentsService {
  constructor(private readonly repository: PaymentsRepository) {}

  async create(
    entityManager: EntityManager,
    reservationId: number,
    userId: number,
  ): Promise<PaymentsModel> {
    const payment = await this.repository.create(entityManager, {
      reservationId,
      userId,
    });

    if (payment == null) {
      throw new ConflictException('결제를 생성하지 못했습니다.');
    }

    return payment;
  }

  // 결제 정보 삭제
  async delete(entityManager: EntityManager, payment: PaymentsModel) {
    await this.repository.deleteById(entityManager, payment.id);
  }

  // outbox 생성
  async createOutbox(
    entityManager: EntityManager,
    dto: PaymentsServiceCreateOutboxDto,
  ) {
    const { payment, ...etc } = dto;
    await this.repository.createdOutbox(entityManager, {
      paymentId: payment.id,
      ...etc,
    });
  }

  // outbox 업데이트
  async updateOutbox(event: PaymentsPaiedEvenDto) {
    await this.repository.updateOutboxByPaymentId(
      event.payment.id,
      OutboxStatusEnum.PUBLISHED,
    );
  }
}
