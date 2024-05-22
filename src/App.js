
import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { Route, Switch, useHistory, useLocation } from 'react-router-dom';
import { SettingOutlined, FolderViewOutlined, HomeOutlined, BulbOutlined } from '@ant-design/icons';
import Layouts from "./Layouts/Layouts";
import HomePage from "./HomePage/LandingPage";

import keycloak from './Keycloak'; // 确保 keycloak.js 路径正确
import axios from 'axios';
import { LOGIN_TIME_COOKIE, levels, getLevelValue } from './Config/UserProfileConfig';
import { setLoginTimeCookie, checkLoginTimeCookie, setupMidnightLogout } from './Utils/AuthUtils';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { setUserInfo, setDefaultUserLevel, resetUserProfileState } from "./store/userProfile-action";
import NoAccessPage from './NoAccessPage'; // 导入 NoAccessPage 组件
import RoutesConfig from "./Config/TabsConfig/RoutesConfig"
import { constrainedMemory } from 'process';

const fixUrl = (pathname) => {
  try {
    const [path, ...params] = pathname.split('&');
    const queryParams = new URLSearchParams();

    // 处理参数部分
    params.forEach(param => {
      const [key, value] = param.split('=');
      if (key && value) {
        queryParams.append(key, value);
      }
    });

    return `${path}?${queryParams.toString()}`;
  } catch (error) {
    console.error('Error fixing URL:', error);
    return pathname; // 如果出错，返回原始 pathname
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

  console.log("routes", routes)
  const urlEndpoint = {
    getPermissionUrl: process.env.REACT_APP_ENV_URL + '/v1/getPermissionLevel'
  };


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
        const level = "B";
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

  useEffect(() => {
    const initialize = async () => {
      if (!didInit.current) {
        didInit.current = true; // 标记已调用初始化函数
        await initKeycloak(); // 初始化 Keycloak

        // 模拟异常的 location.pathname 情况
        // let locationPathname = `http://localhost:3000/#/&state=f193e4bd-fce4-4d81-ab92-04c1f40a1534?session_state=b066b117-5616-41da-b4a2-d3119aae3594?state=7958d51c-8865-4590-aba0-59e3756363fc?session_state=b066b117-5616-41da-b4a2-d3119aae3594&iss=http%3A%2F%2Flocalhost%3A8080%2Frealms%2Fquick-start&code=3a724e9b-a19d-499d-93cc-c4868230ca60.b066b117-5616-41da-b4a2-d3119aae3594.c7d03cb5-1b0a-449e-9b86-303439f07dcf&state=a00ca26b-d9e7-4205-9506-de379d711762&session_state=b066b117-5616-41da-b4a2-d3119aae3594&iss=http%3A%2F%2Flocalhost%3A8080%2Frealms%2Fquick-start&code=f7ec1163-6b73-47d1-9738-0afa43b5de3f.b066b117-5616-41da-b4a2-d3119aae3594.c7d03cb5-1b0a-449e-9b86-303439f07dcf`;
        // console.log("location.pathname----------------");
        // console.log("location.pathname", locationPathname);
        let locationPathname = location.pathname
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
    console.log("RoutesConfig", RoutesConfig)
    const filteredRoutes = RoutesConfig
      .filter(item => item.requiredLevel <= getLevelValue(simulatedLevel))
      .map((item, index) => ({
        ...item,
        key: index.toString(),
      }));

    setRoutes(filteredRoutes);
  }, [simulatedLevel]);

  // 如果 Keycloak 没有初始化，显示加载中
  if (!kcInitialized) {
    return <div>Loading...</div>;
  }

  // 如果 Keycloak 没有初始化，显示加载中
  if (!kcInitialized) {
    return <div>Loading...</div>;
  }

  return (

    <Layouts routes={routes}>
      <Switch>
        {routes.map((item, index) => (
          <Route
            key={index}
            path={item.path}
            exact
            render={(props) => {
              console.log(`Rendering component for path: ${item.path}`);
              return <item.component {...props} routes={routes} />;
            }}
          />
        ))}

        <Route
          path="*"
          render={(props) => (
            getLevelValue(simulatedLevel) >= 1 ?
              <HomePage {...props} routes={routes} /> : <NoAccessPage />
          )}
        />
      </Switch>
    </Layouts>

  );
}

export default App;
