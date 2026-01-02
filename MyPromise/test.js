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
