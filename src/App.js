import logo from './logo.svg';
import React, { useState, useEffect } from 'react';
import './App.css';
import { HashRouter, Route, Switch, Routes } from 'react-router-dom';
import { SettingOutlined, PieChartOutlined, FolderViewOutlined, MessageOutlined, HomeOutlined, BulbOutlined } from '@ant-design/icons';
import Layouts from "./Layouts/Layouts"
import HomePage from "./HomePage/LandingPage"
import FileManagerPage from './FileManagerPage/FileManagerPage';
import XmlEditor from './EditorPage/XmlEditor';
import SecsSignalsTable from './SecsSignalsTable/SecsSignalsTable'
// 在 App.js 或其他组件中
import keycloak from './Keycloak';


function App() {

  const userLevel = 2; // Example user level, you can set this dynamically based on user data
  const userGroups = ['GroupA']; // Example user groups, set this dynamically based on user data

  useEffect(() => {

    if (localStorage.getItem('isLoggedIn') !== 'true') {
      // keycloak.init({ onLoad: 'login-required' })
      //   .then(authenticated => {
      //     if (authenticated) {
      //       localStorage.setItem('isLoggedIn', 'true');
      //       console.log("isLoggedIn",localStorage.getItem('isLoggedIn'))
      //       console.log('User is authenticated');
      //     } else {
      //       console.log('User is not authenticated');
      //     }
      //   })
      //   .catch(error => {
      //     console.error('Keycloak initialization error:', error);
      //   });
    }


  }, []);

  const rawMenuItems = [
    { group: 'MAIN', icon: <HomeOutlined />, title: 'HOME', path: "/", content: "Home Page", level: 1, groups: ['GroupA', 'GroupB'] },
    { group: 'MAIN', icon: <SettingOutlined />, title: 'Editor', path: "/XmlEditor", content: "Editor", level: 2, groups: ['GroupA'] },
    // { group: 'MAIN', icon: <SettingOutlined />, title: 'Config Manager', path:"/ConfigManager", level: 2, groups: ['GroupB'] },
    { group: 'MAIN', icon: <BulbOutlined />, title: 'SECS SIGNAL', path: "/SecsSignalsTable", content: "aaa", level: 3, groups: ['GroupB'] },
    { group: 'MAIN', icon: <FolderViewOutlined />, title: 'FileManager', path: "/FileManagerPage", content: "Secs Command Editor", level: 2, groups: ['GroupA', 'GroupB'] },
  ];

  const menuItems = rawMenuItems
    .filter(item => item.level <= userLevel && item.groups.some(group => userGroups.includes(group)))
    .map((item, index) => ({
      ...item,
      key: index.toString(),
    }));

  return (
    <div className="App">
      <HashRouter>
        <Layouts menuItems={menuItems}>
          <Routes>
            <Route path="/" element={<HomePage menuItems={menuItems} />} />
            <Route path="/XmlEditor" element={<XmlEditor />} />
            {/* <Route path="/ConfigManager" element={<ConfigManagerPage />} /> */}
            <Route path="/SecsSignalsTable" element={<SecsSignalsTable />} />
            <Route path="/FileManagerPage" element={<FileManagerPage />} />
          </Routes>
        </Layouts>
      </HashRouter>
    </div>
  );
}

export default App;
