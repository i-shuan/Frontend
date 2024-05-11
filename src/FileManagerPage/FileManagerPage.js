import React from 'react';
import { Steps, Card, Row, Col } from 'antd';
import GridExample from './GridExample';
import LogProcessor from './LogProcessor/LogProcessor';

const { Step } = Steps;

const FileManagerPage = () => {
  return (
    <Row gutter={16}>
      {/* <Col span={6}>
        <Steps direction="vertical" current={1}>
          <Step title="第一步" description="這是第一步的描述" />
          <Step title="第二步" description="這是第二步的描述" />
          <Step title="第三步" description="這是第三步的描述" />
        </Steps>
      </Col>
      <Col span={18}>
        <Row gutter={16}>
          <Col span={24}>
            <Card title="卡片2" bordered={false}>
              卡片內容
            </Card>
          </Col>
          <Col span={24}>
            <Card title="卡片3" bordered={false}>
              卡片內容
            </Card>
          </Col>
        </Row>
      </Col> */}
      {/* <GridExample/> */}
      <LogProcessor />
    </Row>
  );
};

export default FileManagerPage;
