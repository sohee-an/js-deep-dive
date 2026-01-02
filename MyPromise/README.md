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

1. 비동기적으로 나의 promise가 실행이 될려면 ?(queueMicrotask vs setTimeout)
   Promise는 사양상 마이크로태스크로 동작해야 합니다. setTimeout을 쓰면 Macrotask로 밀려나기 때문에, 브라우저 환경의 queueMicrotask나 Node.js의 process.nextTick을 활용해 정확한 실행 타이밍을 맞추는 것이 핵심입니다.

2. The Thenable Chaining (Promise Chaining)

   2-1 :핵심 고민: "왜 return this가 아닌 new MyPromise인가?"
   처음에는 단순히 자기 자신(this)을 반환하면 체이닝이 될 거라 생각했습니다. 하지만 Promise의 불변성(Immutability) 원칙을 깊게 고민해 본 결과, 다음과 같은 이유로 새로운 객체를 반환하도록 설계했습니다.

   상태의 독립성: 한 번 결정된(Settled) 프로미스의 상태는 변경될 수 없습니다. 하지만 체이닝 된 다음 작업은 이전 작업의 결과에 따라 새로운 상태를 가져야 합니다.

   값의 변형: then 내부에서 리턴된 값은 다음 then으로 전달될 때 변형될 수 있어야 하며, 이를 위해서는 독립적인 결과값을 저장할 새로운 인스턴스가 필수적이었습니다.

   2-2. 설계의 난제: "비동기 파이프라인(Pipeline) 구축"
   이전 작업의 리턴값이 다음 작업의 입력값이 되는 구조를 만들기 위해 **클로저(Closure)**를 활용했습니다.

   고민 포인트: then이 호출되는 시점에는 이전 비동기 작업이 아직 끝나지 않았을 수 있습니다(PENDING).

   해결 전략: onFulfilledCallbacks 배열에 단순한 콜백이 아닌, **'이전 작업의 결과를 기다렸다가, 결과가 나오면 다음 프로미스의 resolve까지 책임지는 래퍼 함수'**를 등록하도록 설계했습니다. 이로써 비동기 흐름 속에서도 데이터가 끊기지 않고 흐르는 파이프라인을 완성했습니다.

   2-3. 예외 처리의 전파 (Error Bubbling)
   체이닝 도중 어느 한 곳에서 에러가 발생했을 때, 이를 어떻게 마지막 catch까지 안전하게 전달할지 고민했습니다.

   try...catch문을 각 단계의 실행 시점(마이크로태스크 내부)에 배치하여, 예상치 못한 런타임 에러를 포착하고 이를 promise2의 reject로 연결해 에러가 체인을 타고 흐르도록 구현했습니다.

3."에러 복구(Recovery)와 전파(Propagation) 메커니즘"

구현 핵심: try...catch 블록을 활용한 Promise 상태 전이

핵심 로직: catch 또는 then의 두 번째 인자인 onRejected 콜백이 정상적으로 값을 반환(return)할 경우, 해당 에러가 처리된 것으로 간주하여 다음 체인의 Promise를 FULFILLED 상태로 전환하도록 설계했습니다.

기술적 의도: 이는 자바스크립트의 동기적 try...catch 문법과 일관성을 유지하며, 개발자가 체인 중간에서 에러를 핸들링하고 다시 정상 흐름으로 복귀할 수 있는 유연성을 제공하기 위함입니다.

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

배운 점 :
promise는 new를 하는 순간 바로 생성가 동시에 작업을 시작한다.나중에 실행되게 하고싶으면 함수로 한번 감싸야 된다.

const createPromise = () =>
new Promise((res) => {
console.log("start");
setTimeout(() => res(1), 1000);
});

const p = createPromise(); // 여기서 시작
