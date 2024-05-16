import React, { useEffect } from 'react';
import { Row, Col } from 'antd';
import LogProcessor from './LogProcessor/LogProcessor';

import { useSelector, useDispatch } from 'react-redux'; // 引入 useDispatch
import { addTodoAsync } from "../store/todo-action";

const FileManagerPage = () => {
  const dispatch = useDispatch(); // 使用 useDispatch 來調用 Redux actions
  const { list } = useSelector((state) => state.todos); // 確保這個路徑與你的 store 結構匹配
  const defaultList = ["1", "2", "3"];

  useEffect(() => {
    if (list.length === 0) { // 檢查應該是 list.length === 0，意味著當列表為空時添加項目
      dispatch(addTodoAsync("123", ""));
    }
  }, [list]); // 將 defaultList 和 dispatch 加入依賴列表

  return (
    <Row gutter={16}>
      <Col span={12}>
        <LogProcessor />
      </Col>
      <Col span={12}>

      </Col>
    </Row>
  );
};

export default FileManagerPage;
