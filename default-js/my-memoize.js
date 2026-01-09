function memoize(fn) {
  // 여기에 캐시를 저장할 공간(Closure)이 필요하겠지?
  const cache = {}; // 이 객체는 memoize 함수가 끝나도 살아있습니다 (Closure)

  return function (...args) {
    // 1. args를 unique한 key로 만든다.
    // 배열 [1, 2]는 객체라 키로 쓸 수 없으니 문자열로 변환합니다.
    const key = JSON.stringify(args);
    console.log('key', key);

    // 2. cache에 key가 있는지 확인한다.
    // (주의: if (cache[key]) 로 하면 반환값이 0이나 false일 때 버그가 생김)
    if (key in cache) {
      // 3. 있으면 캐시된 값 리턴 (연산 X)
      // console.log(`캐시된 값 반환: ${key}`); // 확인용 로그
      return cache[key];
    } else {
      // 4. 없으면 fn(...args) 실행 후 cache에 저장하고 리턴
      const result = fn(...args);
      cache[key] = result;
      return result;
    }
  };
}

// --- 테스트 케이스 ---
const expensiveFunc = (a, b) => {
  console.log('비싼 연산 수행 중...');
  return a + b;
};

const memoizedFunc = memoize(expensiveFunc);

console.log(memoizedFunc(1, 2)); // "비싼 연산 수행 중...", 3
console.log(memoizedFunc(1, 2)); // (로그 없이 바로) 3
console.log(memoizedFunc(2, 3)); // "비싼 연산 수행 중...", 5

// 시니어의 코드 (Encapsulation)
const createCounter = () => {
  let count = 0; // 🔒 이 변수는 절대 밖에서 못 건드림 (클로저)

  return {
    increase: () => ++count,
    getValue: () => count,
  };
};

const myCounter = createCounter();
myCounter.increase(); // OK
myCounter.count = 1000; // ❌ 접근 불가 (Error나 무시됨)
