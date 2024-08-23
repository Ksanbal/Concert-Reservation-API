import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const BASE_URL = 'http://localhost:3000/api';

export const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '10s', target: 100 }, // 선착순 판매임으로 초기 100명의 사용자가 동시에 접속
    { duration: '5m', target: 100 }, // 입장한 사용자가 5분간 서비스에 머무름
    { duration: '1m', target: 50 }, // 좌석 매진 후 점차적으로 사용자를 줄임
    { duration: '1m', target: 40 },
    { duration: '1m', target: 30 },
    { duration: '1m', target: 20 },
    { duration: '1m', target: 10 },
  ],
};

export default async function () {
  const userId = Number(__VU);

  // 토큰 발급 및 진입 대기
  const token = await queue(userId);

  if (token == null) {
    return;
  }

  // 공연 목록 조회
  await getConcertList(token);

  let seat = null;
  let reservationId = null;

  // 좌석 예약에 성공할때까지 빈좌석을 찾아서 예매하도록 반복
  while (reservationId == null) {
    // 공연 좌석 조회
    const seats = await getConcertSeat(token, 1);
    const availableSeats = seats.filter((seat) => seat['status'] === 'open');
    if (availableSeats.length === 0) {
      // 좌석이 없을 경우
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableSeats.length);
    seat = availableSeats[randomIndex];

    // 좌석 예약
    reservationId = await reserveSeat(token, 1, seat['id']);
  }

  // 포인트 충전
  await chargePoint(userId, seat['price']);

  // 좌석 결제
  await pay(token, reservationId);
}

/**
 * 대기열 시나리오
 * 대기열 토큰 발급을 요청하고, 발급된 토큰이 working 상태가 될때까지 대기
 */
function queue(userId) {
  let res = http.post(
    `${BASE_URL}/queue/token`,
    JSON.stringify({
      userId,
    }),
    {
      tags: { name: '대기열 토큰 발급' },
      headers: { 'Content-Type': 'application/json' },
    },
  );
  check(res, { '대기열 토큰 발급': (r) => r.status === 201 });

  if (res.status === 201) {
    const token = res.json().token;

    // 발급받은 대기열 토큰이 입장 가능할때까지 대기
    while (true) {
      res = http.get(`${BASE_URL}/queue/token/validate`, {
        tags: { name: '대기열 토큰 유효성 체크' },
        headers: {
          Authorization: `${token}`,
        },
      });

      if (res.status == 200 && res.json().status === 'working') {
        check(res, { '대기열 토큰 유효성 체크': (r) => r.status === 200 });
        return token;
      } else if (res.status == 404) {
        return null;
      }
      sleep(0.5);
    }
  } else {
    return null;
  }
}

/**
 * 공연 목록 조회
 */
function getConcertList(token) {
  const res = http.get(`${BASE_URL}/concerts`, {
    tags: { name: '공연 목록 조회' },
    headers: {
      Authorization: `${token}`,
    },
  });
  check(res, { '공연 목록 조회': (r) => r.status === 200 });
}

/**
 * 공연 좌석 목록 조회
 */
function getConcertSeat(token, scheduleId) {
  const res = http.get(`${BASE_URL}/concerts/schedules/${scheduleId}/seats`, {
    tags: { name: '공연 좌석 목록 조회' },
    headers: {
      Authorization: `${token}`,
    },
  });
  check(res, { '공연 좌석 조회': (r) => r.status === 200 });

  if (res.status === 200) {
    return res.json();
  }
  return [];
}

/**
 * 좌석 예약
 */
function reserveSeat(token, scheduleId, seatId) {
  const res = http.post(
    `${BASE_URL}/reservations`,
    JSON.stringify({
      scheduleId,
      seatId,
    }),
    {
      tags: { name: '좌석 예약' },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
    },
  );
  check(res, { '좌석 예약': (r) => r.status === 201 });

  if (res.status === 201) {
    return res.json()['id'];
  }
  return null;
}

/**
 * 포인트 충전
 */
function chargePoint(userId, amount) {
  const res = http.patch(
    `${BASE_URL}/users/${userId}/point/charge`,
    JSON.stringify({
      amount,
    }),
    {
      tags: { name: '포인트 충전' },
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  check(res, { '포인트 충전': (r) => r.status === 200 });

  return res.status === 200;
}

/**
 * 좌석 결제
 */
function pay(token, reservationId) {
  const res = http.post(
    `${BASE_URL}/payments`,
    JSON.stringify({
      reservationId,
    }),
    {
      tags: { name: '좌석 결제' },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
    },
  );
  check(res, { '좌석 결제': (r) => r.status === 201 });
  return res.status === 201;
}
