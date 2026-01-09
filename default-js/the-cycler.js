function createCycler(items) {
  // 1. 현재 몇 번째인지 기억할 변수 (Closure)
  let index = 0;

  return function () {
    // 여기에 로직을 작성하세요.
    // 1. 현재 아이템을 가져온다.
    // 2. 다음 번을 위해 index를 1 증가시킨다.
    // 3. (중요) 배열 길이를 넘어가면 다시 0으로 돌아오게 한다. (나머지 연산 % 활용 추천)
    // 4. 아이템 반환.
    // 2. 인덱스 증가 로직
    const currentItem = items[index];
    if (index === items.length - 1) {
      index = 0; // 끝이면 0으로
    } else {
      index++; // 아니면 1 증가
    }

    // 3. 아까 잡아둔 거 리턴
    return currentItem;
  };
}

// 테스트
const trafficLight = createCycler(['🔴', '🟡', '🟢']);

console.log(trafficLight()); // "🔴"
console.log(trafficLight()); // "🟡"
console.log(trafficLight()); // "🟢"
console.log(trafficLight()); // "🔴" (다시 처음으로!)
