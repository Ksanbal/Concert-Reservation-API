import { IsDate, IsNumber, IsString } from 'class-validator';

/**
 * Request
 */
export class ConcertReservationRequestDto {
  @IsNumber()
  scheduleId: number;

  @IsNumber()
  seatId: number;
}

/**
 * Response
 */
export class ConcertResponseDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsDate()
  created_at: Date;

  schedule: ConcertScheduleResponseDto[];

  constructor(args: ConcertResponseProps) {
    Object.assign(this, args);
  }
}

class ConcertScheduleResponseDto {
  @IsNumber()
  id: number;

  @IsDate()
  date: Date;

  @IsNumber()
  left_seat: number;

  constructor(args: ConcertScheduleResponseProps) {
    Object.assign(this, args);
  }
}

type ConcertResponseProps = {
  id: number;
  name: string;
  created_at: string;
  schedule: ConcertScheduleResponseProps[];
};

type ConcertScheduleResponseProps = {
  id: number;
  date: string;
  left_seat: number;
};

export class ConcertScheduleSeatResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  number: number;

  @IsNumber()
  price: number;

  @IsString()
  status: string;

  constructor(args: ConcertScheduleSeatResponseProps) {
    Object.assign(this, args);
  }
}

type ConcertScheduleSeatResponseProps = {
  id: number;
  number: number;
  price: number;
  status: string;
};

export class ConcertReservationResponseDto {
  @IsNumber()
  id: number;

  constructor(args: ConcertReservationResponseProps) {
    Object.assign(this, args);
  }
}

type ConcertReservationResponseProps = {
  id: number;
};

export class ConcertPayReservationResponseDto {
  @IsNumber()
  id: number;

  constructor(args: ConcertPayReservationResponseProps) {
    Object.assign(this, args);
  }
}

type ConcertPayReservationResponseProps = {
  id: number;
};
