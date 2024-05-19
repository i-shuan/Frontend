import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { Route, Switch, useHistory, useLocation } from 'react-router-dom';
import { SettingOutlined, FolderViewOutlined, HomeOutlined, BulbOutlined } from '@ant-design/icons';
import Layouts from "./Layouts/Layouts";
import HomePage from "./HomePage/LandingPage";
import FileManagerPage from './FileManagerPage/FileManagerPage';
import XmlEditor from './EditorPage/XmlEditor';
import SecsSignalsTable from './SecsSignalsTable/SecsSignalsTable';
import keycloak from './Keycloak'; // 确保 keycloak.js 路径正确
import axios from 'axios';
import { LOGIN_TIME_COOKIE, levels, getLevelValue } from './Enum/UserProfileEnums';
import { setLoginTimeCookie, checkLoginTimeCookie, setupMidnightLogout } from './Utils/AuthUtils';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { setUserInfo, setDefaultUserLevel, resetUserProfileState } from "./store/userProfile-action";
import ProtectedRoute from './ProtectedRoute'; // 导入 ProtectedRoute 组件
import NoAccessPage from './NoAccessPage'; // 导入 NoAccessPage 组件

const fixUrl = (url) => {
  try {
    const urlObj = new URL(url, window.location.origin);
    const hash = urlObj.hash.startsWith('#') ? urlObj.hash.substring(1) : urlObj.hash; // 去掉开头的#
    const hashParams = new URLSearchParams(hash);

    const path = urlObj.pathname;
    const queryParams = new URLSearchParams();

    // 处理 hash 参数中的每一个参数
    hashParams.forEach((value, key) => {
      if (key && value) {
        queryParams.set(key, value); // 使用 set 确保没有重复参数
      }
    });

    return `${path}?${queryParams.toString()}`;
  } catch (error) {
    console.error('Error fixing URL:', error);
    return url; // 如果出错，返回原始 URL
  }
};

function App() {
  const dispatch = useDispatch();
  const { simulatedLevel } = useSelector((state) => state.userProfile);
  const [kcInitialized, setKcInitialized] = useState(false); // 跟踪 Keycloak 是否已经初始化
  const [routes, setRoutes] = useState([]); // 存储菜单项
  const didInit = useRef(false); // 跟踪是否已经调用了初始化函数
  const history = useHistory();
  const location = useLocation(); // 获取当前路径

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
        setKcInitialized(true); // 标记 Keycloak 已初始化

        dispatch(setUserInfo(keycloak)); // 存储用户信息
        console.log("keycloak", keycloak);

        const { dept, section, preferred_username } = keycloak.idTokenParsed;

        // // 调整 Axios 请求以正确获取权限级别
        // const response = await axios.get(`${urlEndpoint.getPermissionUrl}`, {
        //   params: { dept, section, preferred_username }
        // });
        // const level = response.data.level;
        const level = "S";
        dispatch(setDefaultUserLevel(level)); // 假设返回的对象中包含 level 属性

        setLoginTimeCookie(); // 设置登录时间 Cookie
        console.log("level", level);
      } else {
        console.error('Keycloak authentication failed');
      }
    } catch (error) {
      console.error('Keycloak initialization failed', error);
    }
  };

  // const fixUrl = (url) => {
  //   const parts = url.split('&');
  //   if (parts.length > 1) {
  //     const path = parts[0];
  //     const queryParams = parts.slice(1).join('&');
  //     return `${path}?${queryParams}`;
  //   }
  //   return url;
  // };

  useEffect(() => {
    const initialize = async () => {
      if (!didInit.current) {
        didInit.current = true; // 标记已调用初始化函数
        await initKeycloak(); // 初始化 Keycloak

        // 模拟异常的 location.pathname 情况
        let locationPathname = `http://localhost:3000/#/&state=f193e4bd-fce4-4d81-ab92-04c1f40a1534?session_state=b066b117-5616-41da-b4a2-d3119aae3594?state=7958d51c-8865-4590-aba0-59e3756363fc?session_state=b066b117-5616-41da-b4a2-d3119aae3594&iss=http%3A%2F%2Flocalhost%3A8080%2Frealms%2Fquick-start&code=3a724e9b-a19d-499d-93cc-c4868230ca60.b066b117-5616-41da-b4a2-d3119aae3594.c7d03cb5-1b0a-449e-9b86-303439f07dcf&state=a00ca26b-d9e7-4205-9506-de379d711762&session_state=b066b117-5616-41da-b4a2-d3119aae3594&iss=http%3A%2F%2Flocalhost%3A8080%2Frealms%2Fquick-start&code=f7ec1163-6b73-47d1-9738-0afa43b5de3f.b066b117-5616-41da-b4a2-d3119aae3594.c7d03cb5-1b0a-449e-9b86-303439f07dcf`;
        console.log("location.pathname----------------");
        console.log("location.pathname", locationPathname);

        // 修正URL，避免出现&state等附加参数，保持在当前页面
        const fixedUrl = fixUrl(locationPathname);
        console.log("fixedUrl----------------");
        console.log("fixedUrl", fixedUrl);

        if (fixedUrl !== locationPathname) {
          history.replace(fixedUrl);
        }
      }
    };

    initialize();

    if (kcInitialized) {
      setupMidnightLogout(setKcInitialized, didInit);
      const interval = setInterval(() => {
        if (!checkLoginTimeCookie()) {
          keycloak.logout();
          Cookies.remove(LOGIN_TIME_COOKIE); // 移除登录时间 Cookie
          setKcInitialized(false); // 重置 Keycloak 初始化状态
          didInit.current = false; // 重置初始化标记
          dispatch(resetUserProfileState());
        } else {
          keycloak.updateToken(30).catch(() => {
            keycloak.logout();
            Cookies.remove(LOGIN_TIME_COOKIE); // 移除登录时间 Cookie
            setKcInitialized(false); // 重置 Keycloak 初始化状态
            didInit.current = false; // 重置初始化标记
            dispatch(resetUserProfileState());
          });
        }
      }, 10000); // 每 10 秒检查一次 token 有效性和登录时间 Cookie
      return () => clearInterval(interval);
    }
  }, [kcInitialized, dispatch, history, location]);

  useEffect(() => {
    const filteredMenuItems = rawMenuItems
      .filter(item => item.level <= getLevelValue(simulatedLevel))
      .map((item, index) => ({
        ...item,
        key: index.toString(),
      }));

    setRoutes(filteredMenuItems);
  }, [simulatedLevel]);

  // 如果 Keycloak 没有初始化，显示加载中
  if (!kcInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <Layouts menuItems={routes}>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <ProtectedRoute path="/XmlEditor" component={XmlEditor} requiredLevel={2} />
          <ProtectedRoute path="/SecsSignalsTable" component={SecsSignalsTable} requiredLevel={3} />
          <ProtectedRoute path="/FileManagerPage" component={FileManagerPage} requiredLevel={4} />
          <Route path="/no-access" component={NoAccessPage} />
        </Switch>
      </Layouts>
    </div>
  );
}

export default App;
