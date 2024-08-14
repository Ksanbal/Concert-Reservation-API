import { PaymentsModel } from '../payments.model';

export type PaymentsServiceCreateOutboxDto = {
  payment: PaymentsModel;
  topic: string;
  key: string;
  value: string;
};
