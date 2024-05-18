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
import keycloak from './Keycloak'; // 确保 keycloak.js 路径正确
import Cookies from 'js-cookie';
import { sign, verify } from './Utils/Sign'; // 假设 sign 和 verify 函数已定义

const LOGIN_TIME_COOKIE = 'loginTime';
const SIGNATURE_KEY = 'your-signature-key';
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

function App() {
  const userLevel = 2; // Example user level, you can set this dynamically based on user data
  const userGroups = ['GroupA']; // Example user groups, set this dynamically based on user data
  const [kcInitialized, setKcInitialized] = useState(false); // 跟踪 Keycloak 是否已经初始化
  const [userInfo, setUserInfo] = useState(null); // 存储用户信息
  const didInit = useRef(false); // 跟踪是否已经调用了初始化函数

  // 设置登录时间 Cookie
  const setLoginTimeCookie = () => {
    const timestamp = new Date().getTime().toString();
    const signature = sign(timestamp, SIGNATURE_KEY);
    Cookies.set(LOGIN_TIME_COOKIE, `${timestamp}#${signature}`, { path: '/' });
  };

  // 检查登录时间 Cookie 是否有效
  const checkLoginTimeCookie = () => {
    const cookie = Cookies.get(LOGIN_TIME_COOKIE);
    if (cookie) {
      const [timestamp, signature] = cookie.split('#');
      if (verify(timestamp, signature, SIGNATURE_KEY)) {
        const now = new Date().getTime();
        if (now - parseInt(timestamp, 10) > TWENTY_FOUR_HOURS) {
          return false; // Cookie 已过期
        }
        return true; // Cookie 有效
      }
    }
    return false; // Cookie 不存在或无效
  };

  // 初始化 Keycloak
  const initKeycloak = async () => {
    try {
      const authenticated = await keycloak.init({ onLoad: 'login-required' });
      if (authenticated) {
        setKcInitialized(true); // 标记 Keycloak 已初始化
        const userProfile = await keycloak.loadUserProfile();
        setUserInfo(userProfile); // 存储用户信息
        console.log("keycloak", keycloak);
        setLoginTimeCookie(); // 设置登录时间 Cookie
      } else {
        console.error('Keycloak authentication failed');
      }
    } catch (error) {
      console.error('Keycloak initialization failed', error);
    }
  };

  // 计算距离午夜的时间
  const calculateTimeToMidnight = () => {
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    return midnight - now;
  };

  // 设置午夜登出
  const setupMidnightLogout = () => {
    const timeToMidnight = calculateTimeToMidnight();
    setTimeout(() => {
      keycloak.logout();
      Cookies.remove(LOGIN_TIME_COOKIE); // 移除登录时间 Cookie
      setKcInitialized(false); // 重置 Keycloak 初始化状态
      didInit.current = false; // 重置初始化标记
    }, timeToMidnight);
  };

  useEffect(() => {
    const initialize = async () => {
      if (!didInit.current) {
        didInit.current = true; // 标记已调用初始化函数
        await initKeycloak(); // 初始化 Keycloak
      }
    };

    initialize();

    if (kcInitialized) {
      setupMidnightLogout();
      const interval = setInterval(() => {
        if (!checkLoginTimeCookie()) {
          keycloak.logout();
          Cookies.remove(LOGIN_TIME_COOKIE); // 移除登录时间 Cookie
          setKcInitialized(false); // 重置 Keycloak 初始化状态
          didInit.current = false; // 重置初始化标记
        } else {
          keycloak.updateToken(30).catch(() => {
            keycloak.logout();
            Cookies.remove(LOGIN_TIME_COOKIE); // 移除登录时间 Cookie
            setKcInitialized(false); // 重置 Keycloak 初始化状态
            didInit.current = false; // 重置初始化标记
          });
        }
      }, 10000); // 每 10 秒检查一次 token 有效性和登录时间 Cookie
      return () => clearInterval(interval);
    }
  }, [kcInitialized]); // 依赖 kcInitialized 确保只在初始化时和登录时运行

  const rawMenuItems = [
    { group: 'MAIN', icon: <HomeOutlined />, title: 'HOME', path: "/", content: "Home Page", level: 1, groups: ['GroupA', 'GroupB'] },
    { group: 'MAIN', icon: <SettingOutlined />, title: 'Editor', path: "/XmlEditor", content: "Editor", level: 2, groups: ['GroupA'] },
    { group: 'MAIN', icon: <BulbOutlined />, title: 'SECS SIGNAL', path: "/SecsSignalsTable", content: "aaa", level: 3, groups: ['GroupB'] },
    { group: 'MAIN', icon: <FolderViewOutlined />, title: 'FileManager', path: "/FileManagerPage", content: "Secs Command Editor", level: 2, groups: ['GroupA', 'GroupB'] },
  ];

  const menuItems = rawMenuItems
    .filter(item => item.level <= userLevel && item.groups.some(group => userGroups.includes(group)))
    .map((item, index) => ({
      ...item,
      key: index.toString(),
    }));

  // 如果 Keycloak 没有初始化，显示加载中
  if (!kcInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <HashRouter>
        <Layouts menuItems={menuItems}>
          <Routes>
            <Route path="/" element={<HomePage menuItems={menuItems} />} />
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
              Cookies.remove(LOGIN_TIME_COOKIE); // 移除登录时间 Cookie
              setKcInitialized(false); // 重置 Keycloak 初始化状态
              didInit.current = false; // 重置初始化标记
            }}>Logout</button>
          </div>
        )}
      </HashRouter>
    </div>
  );
}

export default App;
