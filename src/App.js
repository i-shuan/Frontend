// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { SettingOutlined, FolderViewOutlined, HomeOutlined, BulbOutlined } from '@ant-design/icons';
import Layouts from "./Layouts/Layouts";
import HomePage from "./HomePage/LandingPage";
import FileManagerPage from './FileManagerPage/FileManagerPage';
import XmlEditor from './EditorPage/XmlEditor';
import SecsSignalsTable from './SecsSignalsTable/SecsSignalsTable';
import keycloak from './Keycloak'; // 確保 keycloak.js 路徑正確
import axios from 'axios';

import { LOGIN_TIME_COOKIE, levels, getLevelValue } from './Enum/KeycloakEnums';
import { setLoginTimeCookie, checkLoginTimeCookie, setupMidnightLogout } from './Utils/AuthUtils';
import Cookies from 'js-cookie';

function App() {
  const [userLevel, setUserLevel] = useState(0); // Example user level, you can set this dynamically based on user data
  const userGroups = ['GroupA']; // Example user groups, set this dynamically based on user data
  const [kcInitialized, setKcInitialized] = useState(false); // 跟踪 Keycloak 是否已經初始化
  const [userInfo, setUserInfo] = useState(null); // 存儲用戶信息
  const [routes, setRoutes] = useState([]); // 存儲菜單項
  const didInit = useRef(false); // 跟踪是否已經調用了初始化函數

  const urlEndpoint = {
    getPermissionUrl: process.env.REACT_APP_ENV_URL + '/v1/getPermissionLevel'
  };

  const rawMenuItems = [
    { group: 'MAIN', icon: <HomeOutlined />, title: 'HOME', path: "/", content: "Home Page", level: 1, groups: ['GroupA', 'GroupB'] },
    { group: 'MAIN', icon: <SettingOutlined />, title: 'Editor', path: "/XmlEditor", content: "Editor", level: 2, groups: ['GroupA'] },
    { group: 'MAIN', icon: <BulbOutlined />, title: 'SECS SIGNAL', path: "/SecsSignalsTable", content: "aaa", level: 3, groups: ['GroupB'] },
    { group: 'MAIN', icon: <FolderViewOutlined />, title: 'FileManager', path: "/FileManagerPage", content: "Secs Command Editor", level: 2, groups: ['GroupA', 'GroupB'] },
  ];

  // 初始化 Keycloak
  const initKeycloak = async () => {
    try {
      const authenticated = await keycloak.init({ onLoad: 'login-required' });
      if (authenticated) {
        setKcInitialized(true); // 標記 Keycloak 已初始化

        setUserInfo(keycloak); // 存儲用戶信息
        console.log("keycloak", keycloak);

        const { dept, section, preferred_username } = keycloak.idTokenParsed;

        // 調整 Axios 請求以正確獲取權限級別
        const response = await axios.get(`${urlEndpoint.getPermissionUrl}`, {
          params: { dept, section, preferred_username: 'bob' }
        });
        const level = response.data.level;
        setUserLevel(level); // 假設返回的對象中包含 level 屬性

        setLoginTimeCookie(); // 設置登錄時間 Cookie
        updateRoutes(getLevelValue(level)); // 獲取權限級別後更新 routes
        console.log("level", level);
      } else {
        console.error('Keycloak authentication failed');
      }
    } catch (error) {
      console.error('Keycloak initialization failed', error);
    }
  };

  const updateRoutes = (level) => {
    const filteredMenuItems = rawMenuItems
      .filter(item => item.level <= level && item.groups.some(group => userGroups.includes(group)))
      .map((item, index) => ({
        ...item,
        key: index.toString(),
      }));

    setRoutes(filteredMenuItems);
  };

  useEffect(() => {
    const initialize = async () => {
      if (!didInit.current) {
        didInit.current = true; // 標記已調用初始化函數
        await initKeycloak(); // 初始化 Keycloak
      }
    };

    initialize();

    if (kcInitialized) {
      setupMidnightLogout(setKcInitialized, didInit);
      const interval = setInterval(() => {
        if (!checkLoginTimeCookie()) {
          keycloak.logout();
          Cookies.remove(LOGIN_TIME_COOKIE); // 移除登錄時間 Cookie
          setKcInitialized(false); // 重置 Keycloak 初始化狀態
          didInit.current = false; // 重置初始化標記
        } else {
          keycloak.updateToken(30).catch(() => {
            keycloak.logout();
            Cookies.remove(LOGIN_TIME_COOKIE); // 移除登錄時間 Cookie
            setKcInitialized(false); // 重置 Keycloak 初始化狀態
            didInit.current = false; // 重置初始化標記
          });
        }
      }, 10000); // 每 10 秒檢查一次 token 有效性和登錄時間 Cookie
      return () => clearInterval(interval);
    }
  }, [kcInitialized]); // 依賴 kcInitialized 確保只在初始化時和登錄時運行

  // 如果 Keycloak 沒有初始化，顯示加載中
  if (!kcInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <HashRouter>
        <Layouts menuItems={routes}>
          <Routes>
            <Route path="/" element={<HomePage menuItems={routes} />} />
            <Route path="/XmlEditor" element={<XmlEditor />} />
            <Route path="/SecsSignalsTable" element={<SecsSignalsTable />} />
            <Route path="/FileManagerPage" element={<FileManagerPage />} />
          </Routes>
        </Layouts>
        {userInfo && (
          <div>
            <h3>User Information</h3>
            <p>Name: {userInfo.firstName} {userInfo.lastName}</p>
            <p>Email: {userInfo.email}</p>
            <button onClick={() => {
              keycloak.logout();
              Cookies.remove(LOGIN_TIME_COOKIE); // 移除登錄時間 Cookie
              setKcInitialized(false); // 重置 Keycloak 初始化狀態
              didInit.current = false; // 重置初始化標記
            }}>Logout</button>
          </div>
        )}
      </HashRouter>
    </div>
  );
}

export default App;
