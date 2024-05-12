import React, { useEffect, useState, useRef } from 'react';
import { Avatar, Button, List, Skeleton, Divider } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';

const MismatchList = () => {

  const data = [
    'Apple',
    'Banana',
    'Cherry',
    'Durian',
    'Elderberry',
    'Fig',
    'Grapes',
    'Honeydew',
    'Iced Melon',
    'Jackfruit',
    'Kiwi',
    'Lemon',
    'Mango',
    'Nectarine',
    'Orange',
    'Papaya',
    'Quince',
    'Raspberry',
    'Strawberry',
    'Tangerine',
    'Ugli fruit',
    'Vanilla bean',
    'Watermelon',
    'Xigua',
    'Yellow passionfruit',
    'Zucchini'
  ];

  const [loading, setLoading] = useState(false);
  const [listData, setListData] = useState([]);
  const [page, setPage] = useState(1);
  const scrollRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    // 模拟异步加载数据
    setTimeout(() => {
      const newData = data.slice((page - 1) * 3, page * 3);
      setListData([...listData, ...newData]);
      setLoading(false);
    }, 1000);
  }, [page]);

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = scrollRef.current;
    if (scrollHeight - scrollTop === clientHeight) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const onLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div id="scrollableDiv" ref={scrollRef} onScroll={handleScroll}>
      <div className="mismatch-header">Mismatch</div>
      <InfiniteScroll
        dataLength={listData.length}
        hasMore={listData.length < data.length}
        next={onLoadMore}
        loader={<Skeleton active />}
        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
        scrollableTarget="scrollableDiv"
      >
        <List
          dataSource={listData}
          className="list-item"
          renderItem={(item) => (
            <List.Item key={item}>
              <div className="list-item-text">
                <div className="list-item-content">
                  <div>{item}</div>
                  <div>More Information</div>
                </div>
              </div>
              <div className="list-item-action">
                <Button>Click</Button>
              </div>
            </List.Item>
          )}
        />
      </InfiniteScroll>
    </div>
  );
};

export default MismatchList;
