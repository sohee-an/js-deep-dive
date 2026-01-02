const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
  constructor(executor) {
    this.state = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      if (this.state === PENDING) {
        this.state = FULFILLED;
        this.value = value;

        // TODO 1: 여기서 콜백들을 실행할 때, 그냥 실행하면 '동기'적으로 작동합니다.
        // 어떻게 하면 '현재 실행 중인 모든 코드'가 끝난 뒤에 실행되도록 예약할 수 있을까?
        queueMicrotask(() => {
          this.onFulfilledCallbacks.forEach((callback) => {
            if (typeof callback === 'function') {
              callback(this.value);
            }
          });
        });
      }
    };

    const reject = (reason) => {
      if (this.state === PENDING) {
        this.state = REJECTED;
        this.reason = reason;

        // TODO 2: resolve와 마찬가지로 비동기 스케줄링이 필요합니다.
        this.onRejectedCallbacks.forEach((callback) => callback(this.reason));
      }
    };

    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  then(onFulfilled, onRejected) {
    const realOnFulfilled =
      typeof onFulfilled === 'function' ? onFulfilled : (v) => v;
    const realOnRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (r) => {
            throw r;
          };

    // then은 항상 '새로운 MyPromise'를 반환해야 합니다.
    const promise2 = new MyPromise((resolve, reject) => {
      if (this.state === FULFILLED) {
        queueMicrotask(() => {
          try {
            const prev = realOnFulfilled(this.value);
            resolve(prev);
          } catch (e) {
            reject(e);
          }
        });
      }

      if (this.state === REJECTED) {
        queueMicrotask(() => {
          try {
            const x = realOnRejected(this.value);
            // 2. 중요: 에러 핸들러(catch 등)가 정상적으로 값을 반환했다면,
            // 다음 프로미스는 '성공(FULFILLED)' 상태가 되어야 합니다!
            resolve(x);
          } catch (e) {
            reject(e);
          }
        });
      }
      // [상황 C] 아직 진행 중(PENDING)이라면?
      if (this.state === PENDING) {
        // 나중에 resolve가 불릴 때 실행될 명단에 '함수'를 추가합니다.
        this.onFulfilledCallbacks.push(() => {
          // 💡 여기에 그냥 realOnFulfilled를 넣으면 안 됩니다!
          // promise2의 resolve를 같이 호출해주는 '래퍼 함수'를 넣어야 합니다.
          try {
            // 1. realOnFulfilled 실행
            // 2. 그 결과로 promise2를 resolve/reject 처리
          } catch (e) {
            reject(e);
          }
        });

        this.onRejectedCallbacks.push(() => {
          try {
            // 실패 케이스도 동일하게 처리
          } catch (e) {
            reject(e);
          }
        });
      }
    });

    return promise2;
  }
}

const p = new MyPromise((res) => res(10));

p.then((v) => v * 2) // 여기서 20이 담긴 '새로운 프로미스'가 리턴됨
  .then((v) => v + 5) // 여기서 25가 담긴 '또 다른 프로미스'가 리턴됨
  .then(console.log); // 결국 25 출력

module.exports = MyPromise;
// 1. 여기서 에러가 발생! (차 사고)
const p2 = Promise.reject('네트워크 연결 끊김');

p2.then(
  (data) => console.log('성공:', data), // 실행 안 됨
  (err) => {
    console.log('에러 발생!', err);
    return '기본값 (오프라인 모드 데이터)'; // 2. 여기서 에러를 처리하고 값을 '리턴'함 (수리 완료)
  }
).then((data) => {
  // 3. 짠! 여기서 다시 '성공' 쪽으로 넘어옵니다. (고속도로 재진입)
  console.log('복구 완료, 다음 데이터:', data);
});
