import { useRef, useState } from 'react';

interface UseVirtualScrollProps<T> {
  items: T[];
  itemHeight: number;
  windowHeight: number;
}

export const useVirtualScroll = <T extends object>({
  items,
  itemHeight,
  windowHeight,
}: UseVirtualScrollProps<T>) => {
  // 스크롤 위치 (State)
  const [scrollTop, setScrollTop] = useState<number>(0);
  const rAFRef = useRef<number | null>(null);

  // 1. 스크롤바 전체 높이를 계산을 해야 됨 (가짜 공간)
  const totalHeight = items.length * itemHeight;

  // 2. 화면에 보여줄 아이템 개수 (예: 500px / 50px = 10개)
  const nodeCount = windowHeight / itemHeight;

  // 3. 현재 스크롤 위치에서 시작 인덱스 계산
  // 애매하게 내리면 그 돔을 보여줄려면 그것도 렌더링을 해여 보여줄수있으니
  const startNode = Math.floor(scrollTop / itemHeight);

  // 4. 버퍼(여유분) 설정 (위아래 5개씩 더 그림)
  const bufferSize = 5;

  // 5. 실제 자를 범위 계산 (배열 범위 안 넘어가게 안전장치)
  const visibleStartIndex = Math.max(0, startNode - bufferSize);
  const visibleEndIndex = Math.min(
    items.length,
    startNode + nodeCount + bufferSize
  );

  // 6. 스크롤 이벤트 핸들러
  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  //   const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
  //     const currentScrollTop = e.currentTarget.scrollTop;

  //     // 이미 예약된 갱신 요청이 있다면 무시 (과도한 실행 방지)
  //     if (rAFRef.current) return;

  //     // "다음 프레임에 화면 그릴 때 이 함수 실행해줘"라고 예약
  //     rAFRef.current = requestAnimationFrame(() => {
  //       setScrollTop(currentScrollTop); // 이때 State 변경 -> 리렌더링
  //       rAFRef.current = null; // 실행 끝났으니 초기화
  //     });
  //   };

  // 7. 화면에 그릴 데이터만 자르고, 위치(offsetY) 잡아주기
  const visibleItems = items
    .slice(visibleStartIndex, visibleEndIndex)
    .map((item, index) => ({
      ...item,
      // 여기가 핵심: 잘라낸 아이템이 원래 있어야 할 절대 위치 계산
      // index 가 0부터 들어올거임
      //앞에 잘려나간 개수 + 현재 지금 순서  * 아이템 높이
      offsetY: (visibleStartIndex + index) * itemHeight,
    }));

  return {
    visibleItems,
    totalHeight,
    onScroll,
  };
};
