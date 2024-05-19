// src/Utils/AuthUtils
import Cookies from 'js-cookie';
import { SIGNATURE_KEY, LOGIN_TIME_COOKIE, TWENTY_FOUR_HOURS } from '../Enum/UserProfileEnums';
import { sign, verify } from './Sign';
import keycloak from '../Keycloak';

export const setLoginTimeCookie = () => {
    const timestamp = new Date().getTime().toString();
    const signature = sign(timestamp, SIGNATURE_KEY);
    Cookies.set(LOGIN_TIME_COOKIE, `${timestamp}#${signature}`, { path: '/' });
};

export const checkLoginTimeCookie = () => {
    const cookie = Cookies.get(LOGIN_TIME_COOKIE);
    if (cookie) {
        const [timestamp, signature] = cookie.split('#');
        if (verify(timestamp, signature, SIGNATURE_KEY)) {
            const now = new Date().getTime();
            if (now - parseInt(timestamp, 10) > TWENTY_FOUR_HOURS) {
                return false; // Cookie 已過期
            }
            return true; // Cookie 有效
        }
    }
    return false; // Cookie 不存在或無效
};

export const calculateTimeToMidnight = () => {
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    return midnight - now;
};

export const setupMidnightLogout = (setKcInitialized, didInit) => {
    const timeToMidnight = calculateTimeToMidnight();
    setTimeout(() => {
        keycloak.logout();
        Cookies.remove(LOGIN_TIME_COOKIE); // 移除登錄時間 Cookie
        setKcInitialized(false); // 重置 Keycloak 初始化狀態
        didInit.current = false; // 重置初始化標記
    }, timeToMidnight);
};
