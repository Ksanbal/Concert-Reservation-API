export type PaymentsRepositoryCreateDto = {
  reservationId: number;
  userId: number;
};

export type PaymentsRepositoryCreateOutboxDto = {
  paymentId: number;
  topic: string;
  key: string;
  value: string;
};
