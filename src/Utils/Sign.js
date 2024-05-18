import CryptoJS from 'crypto-js';

export const sign = (data, key) => {
    return CryptoJS.HmacSHA256(data, key).toString(CryptoJS.enc.Hex);
};

export const verify = (data, signature, key) => {
    const expectedSignature = sign(data, key);
    return expectedSignature === signature;
};
