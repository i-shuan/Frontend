// ChartCard.js

import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { Card, Input } from 'antd';
// import './ChartCard.css';

const options = {
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 10,
    data: ['Direct', 'Email', 'Ad', 'Search Engine', 'Video']
  },
  series: [
    {
      name: 'Access Source',
      type: 'pie',
      radius: '50%',
      data: [
        { value: 335, name: 'Direct' },
        { value: 310, name: 'Email' },
        { value: 234, name: 'Ad' },
        { value: 135, name: 'Search Engine' },
        { value: 1548, name: 'Video' }
      ]
    }
  ]
};

const ChartCard = () => {
  return (
    <Card className="chart-card" size="small" title="Pie Chart">
      <ReactEcharts option={options} style={{ height: '100%' }}/>
    </Card>
  );
};

export default ChartCard;
