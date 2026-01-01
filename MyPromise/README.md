MyPromise: Engineering the Event Loop
외부 라이브러리나 async/await 없이, 자바스크립트의 **비동기 처리 메커니즘(Microtask Queue)**을 직접 제어하여 표준 Promise 객체를 재구현하는 딥다이브 프로젝트입니다.

🎯 Project Objective (목적)
비동기 코드가 "어떻게" 동작하는지 추측하는 것을 넘어, 비동기 상태 머신(State Machine)을 직접 설계함으로써 자바스크립트 실행 모델의 근본을 이해합니다.

비동기 추상화: 콜백 헬(Callback Hell)을 해결하는 then 체이닝의 구조적 이해.

스케줄링 제어: 태스크 큐(Macrotask)와 마이크로태스크 큐(Microtask)의 실행 우선순위 직접 제어.

상태 관리: Pending, Fulfilled, Rejected 세 가지 상태의 엄격한 전이(Transition) 구현.

🧠 What I Learned (학습 포인트)
작성하신 학습 커리큘럼(1.1~1.6) 중 이 프로젝트와 직접 연결되는 핵심 개념들입니다.

1. 이벤트 루프와 마이크로태스크 (1.5, 1.6)
   Promise는 일반적인 setTimeout과 달리 Microtask Queue에서 실행됩니다.

고민: queueMicrotask API를 사용하여 일반 콜백보다 먼저 실행되는 우선순위 로직을 어떻게 구현할 것인가?

학습: 콜 스택이 비워지는 즉시 Microtask가 어떻게 점유권을 가져오는지 체감합니다.

2. 실행 컨텍스트와 클로저 (1.2)
   then 메서드는 나중에 실행될 콜백을 내부 배열에 보관했다가, 상태가 변경될 때 꺼내어 실행합니다.

고민: 비동기 시점에 외부 변수에 접근하기 위해 클로저가 어떻게 메모리에 상태를 유지하는가?

학습: 비동기 함수 내부에서 유지되는 Lexical Environment의 생명 주기를 이해합니다.

3. 비동기 에러 전파 (Exception Handling)
   고민: 동기적인 try-catch가 비동기 에러를 잡지 못하는 이유와 이를 해결하기 위한 reject 전파 메커니즘 설계.

학습: 에러가 체인을 타고 전파되는 과정에서 각 catch 핸들러의 역할을 정의합니다.

4. V8 엔진의 비동기 최적화 (1.4)
   학습: Promise 객체가 생성될 때 엔진 수준에서 일어나는 최적화와, 체이닝이 길어질 때의 성능 비용을 고민합니다.

🔥 Key Challenges (구현 시 고민 포인트)
시니어급 시야에서 해결해야 할 기술적 과제들입니다.

1. queueMicrotask vs setTimeout
   Promise는 사양상 마이크로태스크로 동작해야 합니다. setTimeout을 쓰면 Macrotask로 밀려나기 때문에, 브라우저 환경의 queueMicrotask나 Node.js의 process.nextTick을 활용해 정확한 실행 타이밍을 맞추는 것이 핵심입니다.

2. The Thenable Chaining (Promise Chaining)
   then은 항상 새로운 Promise를 반환해야 합니다.

반환된 값이 일반 값인지, 아니면 또 다른 Promise인지 판별하여 재귀적으로 해결(Resolve)하는 로직이 가장 까다로운 부분입니다.

3. Unhandled Rejection Tracking
   에러가 발생했지만 .catch()로 처리되지 않은 경우, 프로세스 수준에서 이를 어떻게 감지하고 경고를 보낼 것인지 설계합니다.

🛠 Engineering Strategy
State Transition: pending -> fulfilled / pending -> rejected (한번 결정된 상태는 바뀌지 않음 - Immutable State)

Execution: 모든 핸들러는 반드시 비동기적으로 실행되어야 함 (Zalgo 방지 - 일관된 비동기성 유지)

Specification: Promises/A+ 사양을 최대한 준수하여 상호 운용성 확보.

🚀 Usage (Example)
JavaScript

const MyPromise = require('./MyPromise');

const promise = new MyPromise((resolve, reject) => {
setTimeout(() => resolve("Success!"), 1000);
});

promise
.then(res => res + " Part 2")
.then(res => console.log(res))
.catch(err => console.error(err));
이 프로젝트를 통해 자바스크립트 비동기의 '블랙박스'를 완전히 열어보게 될 것입니다.
