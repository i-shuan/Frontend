// src/pages/FileManagerPage.jsx
import React from 'react';
import { Tabs } from 'antd';
import { FileManagerTabs } from '../Config/TabsConfig/FileManagerTabsConfig';
import { TabsRoutesEnum } from '../Config/AppRoutesConfig';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTabKey } from '../store/toolViewer-action';

const FileManagerPage = () => {
  const dispatch = useDispatch();
  const activeTabKey = useSelector((state) => state.toolViewer.activeTabKey);

  const handleTabChange = (key) => {
    dispatch(setActiveTabKey(key));
  };


  return (
    <div>
      <h1>檔案管理頁面</h1>
      <Tabs activeKey={activeTabKey} onChange={handleTabChange}>
        {Object.keys(FileManagerTabs).map((key) => (
          <Tabs.TabPane
            tab={
              <span>
                {FileManagerTabs[key].icon}
                {FileManagerTabs[key].label}
              </span>
            }
            key={key}
          >
            {FileManagerTabs[key].content}
          </Tabs.TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default FileManagerPage;
