import keycloak from '../Keycloak';
import Cookies from 'js-cookie';
import { sign, verify } from '../Utils/Sign';
import { keycloakActions } from './keycloak-slice';

const SIGNATURE_KEY = 'your-signature-key';
const LOGIN_TIME_COOKIE = 'loginTime';
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
const TOKEN_REFRESH_INTERVAL = 5 * 60 * 1000; // 每5分鐘刷新一次token

const setLoginTimeCookie = () => {
    const timestamp = new Date().getTime().toString();
    const signature = sign(timestamp, SIGNATURE_KEY);
    Cookies.set(LOGIN_TIME_COOKIE, `${timestamp}#${signature}`, { path: '/' });
};

const checkLoginTimeCookie = () => {
    const cookie = Cookies.get(LOGIN_TIME_COOKIE);
    if (cookie) {
        const [timestamp, signature] = cookie.split('#');
        if (verify(timestamp, signature, SIGNATURE_KEY)) {
            const now = new Date().getTime();
            if (now - parseInt(timestamp, 10) > TWENTY_FOUR_HOURS) {
                return false;
            }
            return true;
        }
    }
    return false;
};

const calculateTimeToMidnight = () => {
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    return midnight - now;
};

const setupTokenRefresh = () => {
    console.log('Setting up token refresh'); // 確認這個函數被調用
    setInterval(() => {
        console.log('Attempting to refresh token'); // 確認定時器運行
        keycloak.updateToken(180).then(refreshed => {
            console.log('Update token promise resolved'); // 確認 promise 被解決
            if (refreshed) {
                console.log('Token successfully refreshed');
                console.log('New token expiration time:', new Date(keycloak.tokenParsed.exp * 1000));
            } else {
                console.log('Token is still valid, no need to refresh');
            }
        }).catch(error => {
            console.error('Failed to refresh token', error);
            keycloak.logout();
        });
    }, TOKEN_REFRESH_INTERVAL);
};



export const initKeycloak = () => async (dispatch) => {
    try {
        console.log('Initializing Keycloak'); // 初始化開始
        const authenticated = await keycloak.init({ onLoad: 'login-required' });
        if (authenticated) {
            console.log("authenticated", keycloak)
            console.log('Keycloak successfully initialized and authenticated'); // 初始化成功
            dispatch(keycloakActions.setInitialized(true));
            dispatch(keycloakActions.setUserInfo(keycloak));
            setLoginTimeCookie();
            setupTokenRefresh(); // 添加 token 刷新邏輯
        } else {
            console.log('Keycloak authentication failed'); // 認證失敗
            dispatch(keycloakActions.setError('Keycloak authentication failed'));
        }
    } catch (error) {
        console.error('Keycloak initialization failed:', error); // 初始化錯誤
        dispatch(keycloakActions.setError('Keycloak initialization failed: ' + error.message));
    }
};
export const setupMidnightLogout = () => (dispatch) => {
    const timeToMidnight = calculateTimeToMidnight();
    setTimeout(() => {
        keycloak.logout();
        Cookies.remove(LOGIN_TIME_COOKIE);
        dispatch(keycloakActions.setInitialized(false));
        dispatch(keycloakActions.clearUserInfo());
    }, timeToMidnight);
};
