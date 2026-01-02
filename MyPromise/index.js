const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
  constructor(executor) {
    this.state = PENDING;
    this.value = undefined;
    this.onFulfilledCallbacks = [];

    const resolve = (value) => {
      if (this.state === PENDING) {
        this.state = FULFILLED;
        this.value = value;
        this.onFulfilledCallbacks.forEach((callback) => callback(this.value));
      }
    };

    const reject = (reason) => {
      if (this.state === PENDING) {
        this.state = REJECTED;
        this.value = reason;
        // reject 콜백도 있으면 여기서 실행 (심화 과정)
      }
    };

    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  then(onFulfilled) {
    if (this.state === FULFILLED) {
      onFulfilled(this.value);
    }
    if (this.state === PENDING) {
      this.onFulfilledCallbacks.push(onFulfilled);
    }
  }
}

// --- 테스트 코드 실행 ---
const p = new MyPromise((resolve) => {
  console.log('1. 비동기 작업 시작...');
  setTimeout(() => {
    resolve('2. 성공 데이터!');
  }, 1000);
});

p.then((res) => {
  console.log('3. 결과 출력:', res);
});
