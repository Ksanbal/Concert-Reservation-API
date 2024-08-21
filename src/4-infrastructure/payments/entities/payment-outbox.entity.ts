import { OutboxEntity } from 'src/libs/database/common/outbox.entity';
import { Column, Entity } from 'typeorm';

@Entity('payment_outbox')
export class PaymentOutboxEntity extends OutboxEntity {
  @Column()
  paymentId: number;
}
