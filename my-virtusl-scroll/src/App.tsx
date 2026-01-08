// import VirtualList from './components/VirtualList';
import BadList from './components/BadList'; // 나쁜 녀석 가져오기
import VirtualList from './components/VirtualList';
import { ListItem } from './types';

const createDummyData = (): ListItem[] => {
  // 개수가 너무 많아서 10만 개면 아예 멈출 수 있으니
  // 일단 1만 개부터 시작해보시는 걸 추천합니다. (자신 있으면 100000으로!)
  return Array.from({ length: 10000 }, (_, index) => ({
    id: index,
    content: `Item ${index} - 렉 걸리는지 확인해보세요`,
  }));
};

const items = createDummyData();

function App() {
  return (
    <div style={{ padding: '20px' }}>
      {/* <h1>성능 테스트: 일반 렌더링 (Bad Case)</h1> */}
      <p>데이터 개수: {items.length.toLocaleString()}개</p>

      {/* VirtualList 대신 BadList 사용 */}
      {/* <BadList items={items} /> */}
      <VirtualList items={items} itemHeight={50} windowHeight={500} />
    </div>
  );
}

export default App;
