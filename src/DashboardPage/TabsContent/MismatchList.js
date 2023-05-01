import React, { useEffect, useState, useRef } from 'react';
import { Avatar, Button, List, Skeleton, Divider} from 'antd';

import InfiniteScroll from 'react-infinite-scroll-component';

import './MismatchList.css';

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
    // const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const scrollRef = useRef(null);

    // const onLoadMore = () => {
    //     setLoading(true);
    //     const newData = data.slice(listData.length, listData.length + 3);
    //     setListData([...listData, ...newData]);
    //     setLoading(false);
    // };

    const handleScroll = () => {
        const { scrollTop, clientHeight, scrollHeight } = scrollRef.current;
        if (scrollHeight - scrollTop === clientHeight) {
          setPage((prevPage) => prevPage + 1);
        }
    };

    return (
        <div id="scrollableDiv">
          <div className="mismatch-header">Mismatch</div>  
          <InfiniteScroll
            dataLength={data.length}
            hasMore={data.length < 10}
            endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
            scrollableTarget="scrollableDiv"
          >
            <List
                dataSource={data}
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
    
}

export default MismatchList;
