// src/Enum/KeycloakEnums.js
export const LOGIN_TIME_COOKIE = 'loginTime';
export const SIGNATURE_KEY = 'your-signature-key';
export const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

export const levelKeys = {
    S: 'S',
    A: 'A',
    B: 'B',
    C: 'C'
};

export const levels = [
    { key: levelKeys.S },
    { key: levelKeys.A },
    { key: levelKeys.B },
    { key: levelKeys.C }
].map((level, index, array) => ({
    ...level,
    value: array.length - index
}));

export const getLevelValue = (key) => {
    const level = levels.find(level => level.key === key);
    return level ? level.value : null; // 返回相應的值，如果未找到則返回 null
};
