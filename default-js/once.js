// 같은 걸 몇번 눌러도 딱 한번만 실행되는 함수
function once(fn) {
  // 1. "이미 실행했나?"를 기억할 변수 (Closure)
  let hasRun = false;
  // 2. "첫 실행 결과"를 기억할 변수 (Closure)
  let result;

  return function (...args) {
    if (hasRun) {
      return result;
    } else {
      result = fn(args);
      return result;
    }
    // 여기에 로직을 작성하세요.
    // 만약 안 실행했으면 -> 실행하고, 결과 저장하고, 상태 바꾸고, 리턴.
    // 만약 이미 실행했으면 -> 저장해둔 결과 리턴.
  };
}

// 테스트
const initialize = once(() => {
  console.log('시스템 초기화 중...');
  return '준비 완료';
});

console.log(initialize()); // "시스템 초기화 중...", "준비 완료"
console.log(initialize()); // "준비 완료" (로그 안 떠야 함)
console.log(initialize()); // "준비 완료" (로그 안 떠야 함)
