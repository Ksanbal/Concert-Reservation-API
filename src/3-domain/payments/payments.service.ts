import { ConflictException, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { PaymentsModel } from './payments.model';
import { PaymentsRepository } from 'src/4-infrastructure/payments/payments.repository';

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
}
