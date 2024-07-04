# Concert-Reservation-API

포인트를 충전하고 콘서트의 좌석을 예매하는 API

## 목차

- [Milestone](https://github.com/Ksanbal/Concert-Reservation-API/milestones)
- [Projects](https://github.com/users/Ksanbal/projects/8/views/1)
- [시퀀스 다이어그램](#시퀀스-다이어그램)
  - [유저 토큰 발급](#유저-토큰-발급)
  - [예약가능 날짜 조회](#예약가능날짜-조회)
  - [예약가능 날짜 조회](#예약가능-날짜-조회)
  - [예약가능 자리 조회](#예약가능-자리-조회)
  - [포인트 잔액 조회](#포인트-잔액-조회)
  - [포인트 충전](#포인트-충전)
  - [결제](#결제)
- [ERD](#erd)

## 시퀀스 다이어그램

### 유저 토큰 발급

```mermaid
sequenceDiagram

loop 순번이 0이고 상태가 working 일때까지 10초마다 조회
  사용자 ->> GET /api/queue/{userId}: 토큰 조회
  GET /api/queue/{userId} ->> 대기열:사용자 토큰 조회 요청

  대기열 ->> 유저: 유효한 유저인지 확인
  유저 -->> 사용자: 유효하지 않은 사용자입니다.

  대기열 ->> 대기열: 해당 유저의 토큰 조회
  opt 토큰이 존재하면
    대기열 -->> 사용자: 토큰, 상태, 순번 반환
  end
  opt 토큰이 존재하지 않으면
    대기열 ->> 대기열: 토큰 생성
    대기열 -->> 사용자: 토큰, 상태, 순번 반환
  end
end
```

### 예약가능 날짜 조회

```mermaid
sequenceDiagram

사용자 ->> Get /api/concerts/schedule: 스케줄 조회
Get /api/concerts/schedule ->> 스케줄: 토큰 & 요청 전달

스케줄 ->> 대기열: 유효한 토큰인지 확인
대기열 -->> 사용자: 유효하지 않은 토큰입니다.

스케줄 ->> 스케줄: 공연 정보 조회
스케줄 -->> 사용자: 공연 정보(이름, 잔여좌석) 반환
```

### 예약가능 자리 조회

```mermaid
sequenceDiagram

사용자 ->> Get /api/concert/schedule/{scheduleId}: 좌석 목록 조회
Get /api/concert/schedule/{scheduleId} ->> 스케줄: 토큰 & 스케줄 id 요청

스케줄 ->> 대기열: 유효한 토큰인지 확인
대기열 -->> 사용자: 유효하지 않은 토큰입니다.

스케줄 ->> 좌석: 해당 공연의 좌석 목록 조회
스케줄 -->> 사용자: 좌석 목록 반환
```

### 좌석 예약 요청

```mermaid
sequenceDiagram

사용자 ->> POST /api/concert/schedule/{schedule}/seat/{seatId}/reservation: 예약 요청
POST /api/concert/schedule/{schedule}/seat/{seatId}/reservation ->> 스케줄: 요청 전달

스케줄 ->> 대기열: 유효한 토큰인지 확인
대기열 -->> 사용자: 유효하지 않은 토큰입니다.

스케줄 ->> 좌석: 해당 좌석 상태 조회 및 예약 가능 상태 조회
좌석 -->> 사용자: 유효하지 않거나 이미 선택된 좌석입니다.

스케줄 ->> 스케줄: 잔여좌석 감소
스케줄 ->> 좌석: 좌석 예약 생성 처리 (expiredAt을 5분후로 지정)
스케줄 -->> 사용자: 예약 정보 반환
```

### 포인트 잔액 조회

```mermaid
sequenceDiagram

사용자 ->> GET /api/point/{userId}: 조회 요청
GET /api/point/{userId} ->> 포인트: 요청 전달
포인트 ->> 유저: 유효한 유저인지 확인
유저 -->> 사용자: 존재하지 않는 유저입니다.
포인트 -->> 사용자: 현재 포인트 정보 반환
```

### 포인트 충전

```mermaid
sequenceDiagram

사용자 ->> PATCH /api/point/{userId}: 충전 요청
PATCH /api/point/{userId} ->> 포인트: 요청 전달
포인트 ->> 유저: 유효한 유저인지 확인
유저 -->> 사용자: 존재하지 않는 유저입니다.
포인트 ->> 포인트: 포인트 충전
포인트 ->> 포인트 내역: 충전 내역 생성
포인트 -->> 사용자: 충전 결과 반환
```

### 결제

```mermaid
sequenceDiagram

사용자 ->> POST /api/concert/schedule/{schedule}/seat/{seatId}/pay: 결제 요청
POST /api/concert/schedule/{schedule}/seat/{seatId}/pay ->> 스케줄: 요청 전달

스케줄 ->> 대기열: 유효한 토큰인지 확인
대기열 -->> 사용자: 유효하지 않은 토큰입니다.

스케줄 ->> 좌석: 유효한 좌석인지 확인
좌석 -->> 사용자: 유효하지 않거나 이미 선택된 좌석입니다.

스케줄 ->> 포인트: 포인트 사용 여부 확인
포인트 -->> 사용자: 포인트가 부족합니다.

스케줄 ->> 좌석: 좌석 결제 처리
좌석 ->> 결제 내역: 결제 내역 생성
스케줄 ->> 포인트: 포인트 차감 요청
포인트 ->> 포인트 내역: 차감 내역 생성
스케줄 -->> 사용자: 결제 정보 반환
```

## ERD

| Table         | Verbose     | Description                |
| ------------- | ----------- | -------------------------- |
| queue         | 대기열      | 사용자의 대기열 토큰 정보  |
| point         | 포인트      | 사용자의 포인트 정보       |
| point_history | 포인트 내역 | 포인트 충전, 사용 내역     |
| concert       | 공연        |                            |
| schedule      | 공연 스케줄 | 공연 날짜 및 잔여좌석 정보 |
| seat          | 공연 좌석   | 공연 스케줄의 좌석 정보    |
| reservation   | 예약        | 사용자의 공연 예약 정보    |

```mermaid
erDiagram

queue {
  id int pk
  created_at datetime
  updated_at datetime

  user_id int fk
  token uuid
  status enum
}

point {
  id int pk
  created_at datetime
  updated_at datetime

  user_id int fk
  amount int
}

point_history {
  id int pk
  created_at datetime
  updated_at datetime

  user_id int fk
  amount int
  type enum
}
```

```mermaid
erDiagram

concert {
  id int pk
  created_at datetime
  updated_at datetime
  deleted_at datetime

  name string
}
concert ||--o{ schedule: one2many

schedule {
  id int pk
  created_at datetime
  updated_at datetime
  deleted_at datetime

  concnert_id int fk
  date datetime
  left_seat int
}
schedule ||--o{ seat: one2many

seat {
  id int pk
  created_at datetime
  updated_at datetime
  deleted_at datetime

  number int
  price int
  status enum
}

reservation {
  id int pk
  created_at datetime
  updated_at datetime
  deleted_at datetime
  expired_at datetime

  user_id int fk
  status enum

  concert_id int fk
  concert_name string

  schedule_id int fk
  schedule_date datetime

  seat_id int fk
  seat_number int
  seat_price int
}
concert ||--o{ reservation: one2many
schedule ||--o{ reservation: one2many
seat ||--o{ reservation: one2many
```
