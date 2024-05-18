// src/Enum/KeycloakEnums.js
export const LOGIN_TIME_COOKIE = 'loginTime';
export const SIGNATURE_KEY = 'your-signature-key';
export const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
export const levels = [
    { key: 'S', value: 99 },
    { key: 'A', value: 25 },
    { key: 'B', value: 24 },
    { key: 'C', value: 23 }
];

export const getLevelValue = (key) => {
    const level = levels.find(level => level.key === key);
    return level ? level.value : null; // 返回相應的值，如果未找到則返回 null
};