import { ListItem } from '../types';

interface BadListProps {
  items: ListItem[];
}

const BadList = ({ items }: BadListProps) => {
  return (
    <div
      style={{
        height: '500px',
        overflowY: 'auto', // 스크롤바 생성
        border: '1px solid red', // 경고의 빨간 테두리
      }}
    >
      {/* 경고: 여기서 10만 번 반복이 일어납니다. 
         React는 10만 개의 가상 DOM을 만들고 -> 실제 DOM에 10만 개를 그립니다.
      */}
      {items.map((item) => (
        <div
          key={item.id}
          style={{
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: '10px',
            borderBottom: '1px solid #eee',
            boxShadow: '2px 2px 5px rgba(0,0,0,0.2)',
            borderRadius: '5px',
            gap: '20px',
          }}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
};

export default BadList;
