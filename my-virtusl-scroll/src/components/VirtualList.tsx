import { useVirtualScroll } from '../hooks/useVirtualScroll';
import { ListItem } from '../types';

interface VirtualListProps {
  items: ListItem[];
  itemHeight: number;
  windowHeight: number;
}

const VirtualList = ({ items, itemHeight, windowHeight }: VirtualListProps) => {
  const { visibleItems, totalHeight, onScroll } = useVirtualScroll({
    items,
    itemHeight,
    windowHeight,
  });

  return (
    <div
      onScroll={onScroll}
      style={{
        height: `${windowHeight}px`,
        overflowY: 'auto',
        border: '1px solid #ccc',
        width: '500px',
        position: 'relative',
      }}
    >
      <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
        {visibleItems.map((item) => (
          <div
            key={item.id}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${itemHeight}px`,
              // 여기가 핵심: GPU 가속을 유도하고 Reflow를 막는 transform 사용
              transform: `translateY(${item.offsetY}px)`,
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '10px',
              boxSizing: 'border-box',
              borderBottom: '1px solid #eee',
              backgroundColor: '#fff',
            }}
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VirtualList;
