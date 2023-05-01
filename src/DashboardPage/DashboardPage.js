import React from 'react';
import { Card, Tabs, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import './DashboardPage.css';
import OverViewPage from "./OverViewComponent/OverViewPage"
const { TabPane } = Tabs;

const DashboardPage = () => {
  
  const tabItems = [
    { title: 'OverView', content: <OverViewPage/>, key: '0' },
    { title: 'Tab 2', content: <p>Content of Tab 2</p>, key: '1' },
  ];

  return (
    <Card className="dashboard-card dashboard-card-content"> 
      <div className="search-container">
        <Input className="search-input" placeholder="Search Tool Type..." prefix={<SearchOutlined className='search-icon' />} />
      </div>
      {/* <Tabs>
        {tabItems.map(item => (
          <TabPane key={item.key} tab={item.title}>
            {item.content}
          </TabPane>
        ))}
      </Tabs> */}
      <OverViewPage/>
    </Card>
  );
}

export default DashboardPage;
