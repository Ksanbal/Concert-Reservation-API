# Token 발급

현재 발급된 유효한 토큰이 있으면 기존 토큰을 반환하고, 아니면 새로 생성해서 반환한다.

## Given

동일한 userId로 100건의 요청을 진행.

```ts
// test.ts
const requestLength = 100;

async function main() {
  console.log('토큰 발급 동시성 이슈 테스트 POST /api/queue/token');

  // 요청
  const requests = Array.from({ length: requestLength }, async (_, i) => {
    const start = Date.now();

    const response = await fetch('http://localhost:3000/api/queue/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: 1,
      }),
    });
    const end = Date.now();
    return [response.status, end - start];
  });

  const result = await Promise.all(requests);

  // 성공수
  let success = 0;
  // 실패수
  let fail = 0;
  // 전체 소요시간
  let total = 0;
  let successTotal = 0;
  let failTotal = 0;

  for (const [status, time, json] of result) {
    if (status == 201) {
      success++;
      successTotal += time;
    } else {
      fail++;
      failTotal += time;
    }
    total += time;
  }

  console.log(`전체 요청 수: ${requestLength}`);
  console.log(`성공수: ${success}`);
  console.log(`실패수: ${fail}`);
  console.log(`평균 소요시간: ${total / requestLength} ms`);
  console.log(`평균 성공 소요시간: ${successTotal / requestLength} ms`);
  console.log(`평균 실패 소요시간: ${failTotal / requestLength} ms`);
}

main();
```

## When

```ts
// queue.service.ts
async create(args: QueueServiceCreateProps): Promise<QueueModel> {
	const queue = await this.dataSource.transaction(async (entityManager) => {
	  let queue = await this.queueRepository.findByUserId(
		entityManager,
		args.userId,
	  );

	  if (!queue) {
		const expiredAt = dayjs().add(10, 'minute').toDate(); // 10분 후

		queue = await this.queueRepository.create(entityManager, {
		  userId: args.userId,
		  expiredAt,
		  status: QueueStatusEnum.WAIT,
		});
	  }

	  return queue;
	});

	// 현재 working인 마지막 queue을 조회
	const lastWorkingQueue = await this.queueRepository.findLastWorkingQueue();

	if (lastWorkingQueue != null) {
	  queue.remain = queue.id - lastWorkingQueue.id;
	}

	return queue;
}

// queue.repository.ts
async findByUserId(
	entityManager: EntityManager,
	userId: number,
	): Promise<QueueModel> {
	const entity = await entityManager
	  .createQueryBuilder(QueueEntity, 'queue')
	  .setLock('pessimistic_read') // pessimistic_read(공유락), pessimistic_write(배타락)
	  .where('queue.userId = :userId', { userId })
	  .andWhere('queue.expiredAt >= :expiredAt', {
		expiredAt: new Date(),
	  })
	  .andWhere('queue.status != :status', {
		status: QueueStatusEnum.EXPIRED,
	  })
	  .getOne();

	return QueueModel.fromEntity(entity);
}

async create(
	entityManager: EntityManager,
	args: QueueRepositoryCreateProps,
	): Promise<QueueModel> {
	let entity = this.queueRepository.create(args);
	entity = await entityManager.save(entity);

	return QueueModel.fromEntity(entity);
}
```

## Then

### Expect

userId당 하나의 row만 생성되고 모두 같은 응답을 받는 것.

### Result

- 낙관적락
  - 로직상 Insert 요청이기 때문에 versioning을 적용할 수 없다.
- 비관적 공유락 - pessimistic_read
  - 100개까지는 아니지만 1개 이상의 동일한 userId의 row가 생성되었다.
  - 가끔 1개만 생성되는 경우도 있었지만 기대한 상황이 아니다.
  - insert 명령이 2번 이상 실행되었기 때문에 평균 소요시간이 더 들었을 것으로 예상된다.

```ts
전체 요청 수: 100
성공수: 100
실패수: 0
평균 소요시간: 326.86 ms
평균 성공 소요시간: 326.86 ms
평균 실패 소요시간: 0 ms
```

- 비관적 배타락 -pessimistic_write
  - Expect와 동일. 하나의 row만 생성되었다.
  - 1번의 insert만 발생하기 때문에, 공유락에 비해 빨리 끝났을 것으로 예상된다.

```ts
전체 요청 수: 100
성공수: 100
실패수: 0
평균 소요시간: 264.46 ms
평균 성공 소요시간: 264.46 ms
평균 실패 소요시간: 0 ms
```

- Simple Lock
  - lock을 획득하지 못하면 DB query가 없기 때문에, 상대적으로 빠른 소요시간을 보여준다.
  - lock을 획득하지 못하면 실패하는 방식이기 때문에, 기존 토큰을 반환하려던 로직과는 상충된다.
  - 개발 편의성 : transaction이전에 획득여부를 확인하고 종료하고 삭제하면 되기 때문에 심플하다.

```ts
전체 요청 수: 100
성공수: 1
실패수: 99
평균 소요시간: 120.47 ms
평균 성공 소요시간: 1.57 ms
평균 실패 소요시간: 118.9 ms

// queue.service.ts
async create(args: QueueServiceCreateProps): Promise<QueueModel> {
  const lock = await this.redis.set('queue', 'lock', 'PX', 2000, 'NX');
  if (!lock) {
    throw new ConflictException('늦었어 돌아가');
  }

  const queue = await this.dataSource.transaction(async (entityManager) => {
    let queue = await this.queueRepository.findByUserId(
      entityManager,
      args.userId,
    );

    if (!queue) {
      const expiredAt = dayjs().add(10, 'minute').toDate(); // 10분 후

      queue = await this.queueRepository.create(entityManager, {
        userId: args.userId,
        expiredAt,
        status: QueueStatusEnum.WAIT,
      });
    }

    return queue;
  });
  await this.redis.del('queue');

  // 현재 working인 마지막 queue을 조회
  const lastWorkingQueue = await this.queueRepository.findLastWorkingQueue();

  if (lastWorkingQueue != null) {
    queue.remain = queue.id - lastWorkingQueue.id;
  }

  return queue;
}
```

- Spin Lock
  - 성공이여도 lock을 획득할때까지 대기하는 시간 때문에 평균 성공 시간이 증가했다.
  - 코드에서 재시도 횟수와 재시도 시간을 지정해줘야하기 때문에 서버의 부담이 되지 않는 적절한 선을 찾아야 할 것 같다.

```ts
전체 요청 수: 100
성공수: 40
실패수: 60
평균 소요시간: 1057.28 ms
평균 성공 소요시간: 216.88 ms
평균 실패 소요시간: 840.4 ms

// queue.service.ts
async create(args: QueueServiceCreateProps): Promise<QueueModel> {
  let lock = null;
  let retry = 0;
  while (true) {
    lock = await this.redis.set('queue', 'lock', 'PX', 2000, 'NX');

    if (lock) {
      break;
    } else {
      retry++;
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (10 < retry) {
        throw new ConflictException('넌 안될 것 같다 그만 돌아가라.');
      }
    }
  }

  const queue = await this.dataSource.transaction(async (entityManager) => {
    let queue = await this.queueRepository.findByUserId(
      entityManager,
      args.userId,
    );

    if (!queue) {
      const expiredAt = dayjs().add(10, 'minute').toDate(); // 10분 후

      queue = await this.queueRepository.create(entityManager, {
        userId: args.userId,
        expiredAt,
        status: QueueStatusEnum.WAIT,
      });
    }

    return queue;
  });
  await this.redis.del('queue');

  // 현재 working인 마지막 queue을 조회
  const lastWorkingQueue = await this.queueRepository.findLastWorkingQueue();

  if (lastWorkingQueue != null) {
    queue.remain = queue.id - lastWorkingQueue.id;
  }

  return queue;
}
```

- Pub/Sub Lock

```ts
// queue.service.ts
```

- 추가 Redis를 이용해 분산락을 구현할때 value 값은 고유한 값을 사용하는걸 권장한다고 한다. 이유는 lock을 획득하지 않은 다른 client에서 삭제할 가능성이 있기 때문이다.

```ts
async create(args: QueueServiceCreateProps): Promise<QueueModel> {
  const value = Date.now();
  const lock = await this.redis.set('queue', value, 'PX', 2000, 'NX');

  if (!lock) {
    throw new ConflictException('넌 안될 것 같다 그만 돌아가라.');
  }

  const queue = await this.dataSource.transaction(async (entityManager) => {
    let queue = await this.queueRepository.findByUserId(
      entityManager,
      args.userId,
    );

    if (!queue) {
      const expiredAt = dayjs().add(10, 'minute').toDate(); // 10분 후

      queue = await this.queueRepository.create(entityManager, {
        userId: args.userId,
        expiredAt,
        status: QueueStatusEnum.WAIT,
      });
    }

    return queue;
  });
  const deleteResult = await this.redis.eval(
    `
    if redis.call("get",KEYS[1]) == ARGV[1] then
        return redis.call("del",KEYS[1])
    else
        return 0
    end
    `,
    1,
    'queue',
    value,
  );
  if (deleteResult == 0) {
    throw new Error('lock이 해제되지 않았습니다.');
  }

  // 현재 working인 마지막 queue을 조회
  const lastWorkingQueue = await this.queueRepository.findLastWorkingQueue();

  if (lastWorkingQueue != null) {
    queue.remain = queue.id - lastWorkingQueue.id;
  }

  return queue;
}
```
