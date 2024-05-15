import React, { useEffect } from 'react';
import { notification } from 'antd';
import "./CustomNotification.css";

const CustomNotification = () => {
    const toolProfile = {
        toolID: "AAAAAA",
        toolGroup: null,
        deployType: null,
        deployEnv: "F15ETCSL02",
        tcsServerIp: "120.111.155.101",
        tcsHostName: "F15ETCSL02",
        tapVersion: null,
        swVersion: null,
        tcsVersion: null,
        mesPhase: "MES1",
    };

    useEffect(() => {
        // 檢查 toolProfile 中的每個屬性是否為 null
        const nullKeys = Object.entries(toolProfile).filter(([key, value]) => value === null).map(([key]) => key);

        if (nullKeys.length > 0) {
            // 如果發現 null 值，顯示錯誤通知
            notification.error({
                message: '配置錯誤',
                description: `以下配置屬性為空，請檢查：${nullKeys.join(', ')}`,
                duration: 600,  // 通知顯示時間，單位秒
            });
        }
    }, []); // 空依賴數組表示此副作用只在組件掛載時運行一次

    return (
        <div>
            檢查配置信息...
        </div>
    );
};

export default CustomNotification;
