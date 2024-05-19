import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { HashRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { SettingOutlined, FolderViewOutlined, HomeOutlined, BulbOutlined } from '@ant-design/icons';
import Layouts from "./Layouts/Layouts";
import HomePage from "./HomePage/LandingPage";
import FileManagerPage from './FileManagerPage/FileManagerPage';
import XmlEditor from './EditorPage/XmlEditor';
import SecsSignalsTable from './SecsSignalsTable/SecsSignalsTable';
import keycloak from './Keycloak'; // 確保 keycloak.js 路徑正確
import axios from 'axios';

import { LOGIN_TIME_COOKIE, levels, getLevelValue } from './Enum/UserProfileEnums';
import { setLoginTimeCookie, checkLoginTimeCookie, setupMidnightLogout } from './Utils/AuthUtils';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { setUserInfo, setDefaultUserLevel, resetUserProfileState } from "./store/userProfile-action";
function App() {

  const dispatch = useDispatch();
  const { simulatedLevel } = useSelector((state) => state.userProfile);
  const [kcInitialized, setKcInitialized] = useState(false); // 跟踪 Keycloak 是否已經初始化
  const [routes, setRoutes] = useState([]); // 存儲菜單項
  const didInit = useRef(false); // 跟踪是否已經調用了初始化函數

  const urlEndpoint = {
    getPermissionUrl: process.env.REACT_APP_ENV_URL + '/v1/getPermissionLevel'
  };

  const rawMenuItems = [
    { group: 'MAIN', icon: <HomeOutlined />, title: 'HOME', path: "/", content: "Home Page", level: 1 },
    { group: 'MAIN', icon: <SettingOutlined />, title: 'Editor', path: "/XmlEditor", content: "Editor", level: 2 },
    { group: 'MAIN', icon: <BulbOutlined />, title: 'SECS SIGNAL', path: "/SecsSignalsTable", content: "aaa", level: 3 },
    { group: 'MAIN', icon: <FolderViewOutlined />, title: 'FileManager', path: "/FileManagerPage", content: "Secs Command Editor", level: 4 },
  ];

  // 初始化 Keycloak
  const initKeycloak = async () => {
    try {
      const authenticated = await keycloak.init({ onLoad: 'login-required' });
      if (authenticated) {
        setKcInitialized(true); // 標記 Keycloak 已初始化

        dispatch(setUserInfo(keycloak)); // 存儲用戶信息
        console.log("keycloak", keycloak);

        const { dept, section, preferred_username } = keycloak.idTokenParsed;

        // 調整 Axios 請求以正確獲取權限級別
        const response = await axios.get(`${urlEndpoint.getPermissionUrl}`, {
          params: { dept, section, preferred_username }
        });
        const level = response.data.level;
        dispatch(setDefaultUserLevel(level)); // 假設返回的對象中包含 level 屬性

        setLoginTimeCookie(); // 設置登錄時間 Cookie
        console.log("level", level);
      } else {
        console.error('Keycloak authentication failed');
      }
    } catch (error) {
      console.error('Keycloak initialization failed', error);
    }
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
          dispatch(resetUserProfileState());
        } else {
          keycloak.updateToken(30).catch(() => {
            keycloak.logout();
            Cookies.remove(LOGIN_TIME_COOKIE); // 移除登錄時間 Cookie
            setKcInitialized(false); // 重置 Keycloak 初始化狀態
            didInit.current = false; // 重置初始化標記
            dispatch(resetUserProfileState());
          });
        }
      }, 10000); // 每 10 秒檢查一次 token 有效性和登錄時間 Cookie
      return () => clearInterval(interval);
    }
  }, [kcInitialized]); // 依賴 kcInitialized 確保只在初始化時和登錄時運行

  useEffect(() => {
    const filteredMenuItems = rawMenuItems
      .filter(item => item.level <= getLevelValue(simulatedLevel))
      .map((item, index) => ({
        ...item,
        key: index.toString(),
      }));

    setRoutes(filteredMenuItems);
  }, [simulatedLevel]);

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
      </HashRouter>
    </div>
  );
}

export default App;