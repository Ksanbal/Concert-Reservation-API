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
- [API 명세서](#api-명세서)

## 시퀀스 다이어그램

### 대기열

#### 대기열 토큰 발급

```mermaid
sequenceDiagram

사용자 ->> POST /api/queue/token: 토큰 발급 요청
POST /api/queue/token ->> 대기열: 사용자 정보 전달

대기열 ->> 유저: 유효한 사용자인지 확인
유저 -->> 사용자: 유효하지 않은 사용자입니다.

대기열 ->> 대기열: 해당 유저의 토큰 조회
opt 만료되지 않은 토큰이 존재하면
  대기열 -->> 사용자: 토큰, 상태, 순번 반환
end
opt 토큰이 존재하지 않으면
  대기열 ->> 대기열: 토큰 생성
  대기열 -->> 사용자: 토큰, 상태, 순번 반환
end
```

#### 대기열 토큰 유효성 체크

```mermaid
sequenceDiagram

사용자 ->> GET /api/queue/token/validate: 토큰 유효성 체크
GET /api/queue/token/validate ->> 대기열: 토큰 정보 전달

대기열 ->> 대기열: 토큰 정보 조회
opt 토큰이 존재하지 않으면
  대기열 -->> 사용자: 토큰이 존재하지 않습니다.
end

opt 토큰이 만료되었다면
  대기열 -->> 사용자: 이미 만료된 토큰입니다.
end

opt 토큰이 존재하면
  대기열 -->> 사용자: 토큰, 상태, 순번 반환
end
```

#### 대기열 토큰 유효기간 연장

```mermaid
sequenceDiagram

사용자 ->> PUT /api/queue/token: 토큰 유효기간 연장 요청
PUT /api/queue/token ->> 대기열: 토큰 정보 전달

대기열 ->> 대기열: 토큰 정보 조회
opt 토큰이 존재하지 않으면
  대기열 -->> 사용자: 토큰이 존재하지 않습니다.
end

opt 만료된 토큰이라면
  대기열 -->> 사용자: 이미 만료된 토큰입니다.
end

opt 토큰이 존재하면
  대기열 ->> 대기열: 토큰 만료시간을 연장
  대기열 -->> 사용자: 토큰, 상태, 순번 반환
end
```

#### 대기열 토큰 삭제

```mermaid
sequenceDiagram

사용자 ->> DELETE /api/queue/token: 토큰 삭제
DELETE /api/queue/token ->> 대기열: 토큰 삭제

대기열 ->> 대기열: 토큰 정보 조회
opt 토큰이 존재하지 않으면
  대기열 -->> 사용자: 토큰이 존재하지 않습니다.
end

대기열 ->> 대기열: 토큰 hard delete 처리

대기열 -->> 사용자: 토큰이 삭제되었습니다.
```

#### 대기열 토큰 상태 및 만료시간 업데이트 스케줄

```mermaid
sequenceDiagram

loop 10초마다 반복
  대기열 ->> 대기열: 상태가 working인 토큰의 개수를 확인
  opt working 상태인 토큰의 개수가 허용개수 보다 작으면
    대기열 ->> 대기열: 전체 허용개수 - 현재 활성 토큰 수 만큼 상태변경 및 만료시간 부여
  end
end
```

### 공연

#### 예약가능 날짜 조회

```mermaid
sequenceDiagram

사용자 ->> Get /api/concerts: 공연 조회
Get /api/concerts ->> 공연: 토큰 & 요청 전달

공연 ->> 대기열: 유효한 토큰인지 확인
대기열 -->> 사용자: 유효하지 않은 토큰입니다.

공연 ->> 공연: 공연 정보 조회
공연 -->> 사용자: 공연 정보(이름, 잔여좌석) 반환
```

#### 예약가능 자리 조회

```mermaid
sequenceDiagram

사용자 ->> Get /api/concerts/schedules/{scheduleId}/seats: 좌석 목록 조회
Get /api/concerts/schedules/{scheduleId}/seats ->> 공연: 토큰 & 공연 스케줄 id 전달

공연 ->> 대기열: 유효한 토큰인지 확인
대기열 -->> 사용자: 유효하지 않은 토큰입니다.

공연 ->> 공연: 해당 공연 스케줄의 좌석 목록 조회
공연 -->> 사용자: 좌석 목록 반환
```

#### 좌석 예약 요청

```mermaid
sequenceDiagram

사용자 ->> POST /api/reservations: 예약 요청
POST /api/reservations ->> 예약: 토큰 & 요청 전달

예약 ->> 대기열: 유효한 토큰인지 확인
activate 대기열
대기열 -->> 사용자: 유효하지 않은 토큰입니다.
대기열 ->> 예약: 사용자 정보 반환
deactivate 대기열


예약 ->> 공연: 좌석 예약처리 요청
activate 공연
공연 ->> 공연: 요청한 공연 스케줄의 좌석 상태 조회 및 예약 가능 상태 조회
공연 -->> 사용자: 유효하지 않거나 이미 선택된 좌석입니다.
공연 ->> 예약: 성공여부 반환
deactivate 공연

예약 ->> 예약: 좌석 예약 생성 처리 (expiredAt을 5분후로 지정)
예약 -->> 사용자: 예약 정보 반환
```

#### 좌석 예약 반환 스케줄

```mermaid
sequenceDiagram

loop 10초마다 반복
  예약 ->> 예약: 예약시간이 만료된 예약 목록 조회
  예약 ->> 공연: 해당 예약의 좌석 상태를 예약가능으로 변경 요청
end
```

### 결제

```mermaid
sequenceDiagram


사용자 ->> POST /api/payments: 결제 요청
POST /api/payments ->> 결제: 토큰 & 요청 전달

결제 ->> 대기열: 유효한 토큰인지 확인
activate 대기열
대기열 -->> 사용자: 유효하지 않은 토큰입니다.
대기열 ->> 결제: 사용자 정보 반환
deactivate 대기열

결제 ->> 예약: 예약정보 조회
activate 예약
예약 -->> 사용자: 유효하지않은 예약입니다.
예약 ->> 결제: 예약정보 반환
deactivate 예약

결제 ->> 유저: 포인트 차감 요청
activate 유저
유저 -->> 사용자: 포인트가 부족합니다.
유저 ->> 유저: 유저 포인트 차감 내역 생성
deactivate 유저

결제 ->> 예약: 예약 상태를 결제로 변경 요청

결제 ->> 공연: 예약했던 공연 스케줄의 좌석의 상태를 결제로 변경 요청
결제 -->> 사용자: 결제 정보 반환
```

### 포인트

#### 포인트 잔액 조회

```mermaid
sequenceDiagram

사용자 ->> GET /api/users/{userId}/point: 조회 요청
GET /api/users/{userId}/point ->> 유저: 요청 전달
activate 유저
유저 -->> 사용자: 존재하지 않는 유저입니다.
유저 ->> 유저: 유저의 포인트 정보 조회
유저 -->> 사용자: 현재 포인트 정보 반환
deactivate 유저
```

#### 포인트 충전

```mermaid
sequenceDiagram

사용자 ->> PATCH /api/users/{userId}/point/charge: 충전 요청
PATCH /api/users/{userId}/point/charge ->> 유저: 요청 전달
activate 유저
유저 -->> 사용자: 존재하지 않는 유저입니다.
유저 ->> 유저: 포인트 충전 & 포인트 충전 내역 생성
유저 -->> 사용자: 충전 결과 반환
deactivate 유저
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

## API 명세서

**목차**

- [대기열 토큰 발급 및 조회](#대기열-토큰-발급-및-조회)
- [공연 날짜 조회](#공연-날짜-조회)
- [공연 좌석 조회](#공연-좌석-조회)
- [공연 예약](#공연-예약)
- [공연 결제](#공연-결제)
- [포인트 조회](#포인트-조회)
- [포인트 충전](#포인트-충전-1)

### 대기열 토큰 발급 및 조회

현재 유저의 대기열 정보를 조회합니다.

- `GET /api/queue/:userId`
- **Path Parameter**
  | Key | Description |
  | ------ | ----------- |
  | userId | 사용자 id |
- **Response**
  ```json
  // 200 OK
  {
    "token": "d07edb0f-3ac1-45a3-8972-7d263958b59d", // uuid
    "status": "wait", // wait, working
    "remain": 1
  }
  ```

### 공연 날짜 조회

공연 목록을 조회합니다.

- `GET /api/concert`
- **Header**
  | Key | Description |
  | ------ | ----------- |
  | Authorization | 대기열 토큰 |
- **Response**

  ```json
  // 200 OK
  [
    {
      "id": 1,
      "name": "카리나의 왁자지껄",
      "created_at": "2023-04-12T14:30:00+09:00",
      "schedule": [
        {
          "id": 1,
          "date": "2023-04-12T14:30:00+09:00",
          "left_seat": 50,
        }
      ]
    }
  ]

  // 401 Unauthorized
  {
    "message": "유효하지 않은 토큰입니다."
  }

  // 403 Forbidden
  {
    "message": "유효하지 않은 토큰입니다."
  }
  ```

### 공연 좌석 조회

해당 공연의 좌석 목록을 조회합니다.

- `GET /api/concert/schedule/:scheduleId`
- **Header**
  | Key | Description |
  | ------ | ----------- |
  | Authorization | 대기열 토큰 |
- **Path Parameter**
  | Key | Description |
  | ------ | ----------- |
  | scheduleId | 공연 스케줄 id |
- **Response**

  ```json
  // 200 OK
  [
    {
      "id": 1,
      "number": 1,
      "price": 50000,
      "status": "Available" // Available, Reserved, Purchased
    }
  ]

  // 401 Unauthorized
  {
    "message": "유효하지 않은 토큰입니다."
  }

  // 403 Forbidden
  {
    "message": "유효하지 않은 토큰입니다."
  }
  ```

### 공연 예약

공연을 예약합니다.

- `POST /api/concert/schedule/reservation`
- **Header**
  | Key | Description |
  | ------ | ----------- |
  | Authorization | 대기열 토큰 |
- **Request Body**
  | Key | Type | Description |
  | ------ | ----------- |-|
  | scheduleId | int | 공연 날짜 id |
  | seatId | int | 좌석 id |
  ```json
  {
    "scheduleId": 1,
    "seatId": 1
  }
  ```
- **Response**

  ```json
  // 201 Created
  {
    "id": 1
  }

  // 400 Bad Request
  {
    "message": "이미 선택된 좌석입니다."
  }

  // 401 Unauthorized
  {
    "message": "유효하지 않은 토큰입니다."
  }

  // 403 Forbidden
  {
    "message": "유효하지 않은 토큰입니다."
  }
  ```

### 공연 결제

사용자가 예약한 공연을 결제합니다.

- `PATCH /api/concert/schedule/reservation/:reservationId`
- **Header**
  | Key | Description |
  | ------ | ----------- |
  | Authorization | 대기열 토큰 |
- **Path Parameter**
  | Key | Description |
  | ------ | ----------- |
  | reservationId | 예약 id |
- **Response**

  ```json
  // 200 Ok
  {
    "id": 1
  }

  // 400 Bad Request
  {
    "message": "포인트가 부족합니다."
  }

  {
    "message": "유효하지 않은 접근입니다."
  }

  // 401 Unauthorized
  {
    "message": "유효하지 않은 토큰입니다."
  }

  // 403 Forbidden
  {
    "message": "유효하지 않은 토큰입니다."
  }
  ```

### 포인트 조회

현재 유저의 포인트 정보를 조회합니다.

- `GET /api/point/:userId`
- **Path Parameter**
  | Key | Description |
  | ------ | ----------- |
  | userId | 사용자 id |
- **Response**
  ```json
  // 200 Ok
  {
    "amount": 100000
  }
  ```

### 포인트 충전

현재 유저의 포인트를 충전합니다.

- `PATCH /api/point/:userId`
- **Path Parameter**
  | Key | Description |
  | ------ | ----------- |
  | userId | 사용자 id |
- **Request Body**
  | Key | Type | Description |
  | ------ | ----------- |-|
  | amount | int | 충전 금액 |
  ```json
  {
    "amount": 50000
  }
  ```
- **Response**

  ```json
  // 200 Ok
  ```
