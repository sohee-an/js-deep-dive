//디바운스 구현하기
function debounce(func, delay) {
  let timer;

  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }

    //  새로운 타이머 설정하고, 그 ID를 다시 timer 변수에 저장
    //    (덮어쓰기 하므로 이전 ID는 사라지고 새 ID가 남음)
    timer = setTimeout(() => {
      func(...args); // delay 시간이 지나면 실제 함수 실행
    }, delay);
  };
}
