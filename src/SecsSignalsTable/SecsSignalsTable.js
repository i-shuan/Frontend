import React from 'react';
import { Card } from 'antd';
import './SecsSignalsTable.css';
import { DownloadFile } from "./DownloadFile";
import DateTimeRangeFilter from "./DateTimeRangeFilter";
import GroupComplete from "./GroupComplete"
import ConvertJsonToLog from "./ConvertJsonToLog"

import CustomCascader from './CustomCascader';

const signalsMappingStruc = {
  "-1": "🔴",
  "0": "🟡",
  "1": "🟢"
};

const getSignalValueData = {
  "LP1": 0,
  "LP2": 1,
  "LP3": -1,
  "LP4": 0,
  "LP5": 1
};

const signals = Object.entries(getSignalValueData).map(([key, value]) => `${key}: <span style="font-size: 24px;">${signalsMappingStruc[value]}</span> `).join('');

const SecsSignalsCard = () => {


  return (
    <div>
      <Card style={{ width: 'fit-content' }}>
        <div dangerouslySetInnerHTML={{ __html: signals }} />
      </Card>
      <DateTimeRangeFilter />
      <GroupComplete />
      {/* <DownloadFile/> */}
      {/* <ConvertJsonToLog/> */}
      <CustomCascader />
    </div>
  )
};

export default SecsSignalsCard;
