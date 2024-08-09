import { Injectable } from '@nestjs/common';
import { PaymentEntity } from './entities/payment.entity';
import { EntityManager } from 'typeorm';
import { PaymentsRepositoryCreateDto } from './payments.repository-dto';
import { PaymentsModel } from 'src/3-domain/payments/payments.model';

@Injectable()
export class PaymentsRepository {
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
}
