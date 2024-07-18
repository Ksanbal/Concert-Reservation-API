import { PaymentEntity } from 'src/4-infrastructure/payments/entities/payment.entity';

export class PaymentsModel {
  constructor(
    public id: number,
    public createdAt: Date,
    public reservationId: number,
    public userId: number,
  ) {}

  static fromEntity(entity: PaymentEntity) {
    return new PaymentsModel(
      entity.id,
      entity.createdAt,
      entity.reservationId,
      entity.userId,
    );
  }
}
