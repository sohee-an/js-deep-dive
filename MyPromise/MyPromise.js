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
    if (this.state === FULFILLED) {
      queueMicrotask(() => {
        onFulfilled?.(this.value);
      });
    }

    if (this.state === REJECTED) {
      queueMicrotask(() => {
        onRejected?.(this.reason);
      });
    }

    if (this.state === PENDING) {
      this.onFulfilledCallbacks.push(onFulfilled);
      this.onRejectedCallbacks.push(onRejected);
    }
  }
}

module.exports = MyPromise;
