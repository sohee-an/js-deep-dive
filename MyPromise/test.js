const MyPromise = require('./MyPromise.js');
const describe = (msg, fn) => {
  console.log(`\n📌 ${msg}`);
  fn();
};
const it = (msg, cond) => {
  // 비동기 테스트를 위해 약간의 지연 후 결과 출력
  setTimeout(() => {
    console.log(cond ? ` ✅ PASS: ${msg}` : ` ❌ FAIL: ${msg}`);
  }, 0);
};

// 3. 실제 테스트 실행
describe('MyPromise 순서 테스트', () => {
  let result = '';
  result += 'A';

  new MyPromise((res) => {
    res('B');
  }).then((val) => {
    result += val;
  });

  result += 'C';

  // 검증: A -> C -> B 순서여야 함
  setTimeout(() => {
    it(
      '동기 코드(A,C)가 모두 실행된 후 비동기(B)가 실행되어야 한다',
      result === 'ACB'
    );
  }, 100);
});

describe('MyPromise 체이닝 테스트', () => {
  // 테스트 1: 값의 전파
  new MyPromise((res) => res(10))
    .then((val) => val * 2)
    .then((val) => {
      it(
        '첫 번째 then의 리턴값이 두 번째 then으로 전달되어야 함 (10 * 2 = 20)',
        val === 20
      );
    });

  // 테스트 2: 비동기 상황에서의 체이닝
  let asyncResult = '';
  new MyPromise((res) => {
    setTimeout(() => res('A'), 100);
  })
    .then((val) => val + 'B')
    .then((val) => {
      asyncResult = val;
    });

  setTimeout(() => {
    it(
      '비동기 작업 이후에도 체이닝이 정상적으로 작동해야 함 (AB)',
      asyncResult === 'AB'
    );
  }, 200);
});
