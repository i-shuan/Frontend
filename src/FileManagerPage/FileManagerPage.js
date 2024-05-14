import React from 'react';
import { Steps, Card, Row, Col } from 'antd';
import GridExample from './GridExample';
import LogProcessor from './LogProcessor/LogProcessor';
import CustomNotification from './Notification/CustomNotification'
const { Step } = Steps;

const FileManagerPage = () => {
  return (
    <Row gutter={16}>
      <LogProcessor />
      <CustomNotification />
    </Row>
  );
};

export default FileManagerPage;
