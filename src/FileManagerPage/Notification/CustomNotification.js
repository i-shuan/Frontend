import React, { useEffect } from 'react';
import { notification } from 'antd';
import "./CustomNotification.css";
import { NotificationTypeEnum, NotificationMessagesEnum } from "../../Enum/NotificationEnums"

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

    // const toolProfile = {
    //     toolID: "AAAAAA",
    //     toolGroup: "AAAAAA",
    //     deployType: "AAAAAA",
    //     deployEnv: "F15ETCSL02",
    //     tcsServerIp: "120.111.155.101",
    //     tcsHostName: "F15ETCSL02",
    //     tapVersion: "AAAAAA",
    //     swVersion: "AAAAAA",
    //     tcsVersion: "AAAAAA",
    //     mesPhase: "MES1",
    // };

    const showNotification = (messageEnum, keys = [], duration = 6) => {
        const { type, message, description } = messageEnum;
        notification[type]({
            message,
            description: typeof description === 'function' ? description(keys) : description,
            duration
        });
    };


    useEffect(() => {
        // 檢查 toolProfile 中的每個屬性是否為 null
        const nullKeys = Object.entries(toolProfile).filter(([key, value]) => value === null).map(([key]) => key);

        if (nullKeys.length > 0) {
            showNotification(NotificationMessagesEnum.CONFIG_ERROR, nullKeys);
        } else {
            showNotification(NotificationMessagesEnum.CONFIG_SUCCESS);
        }
    }, []); // 空依賴數組表示此副作用只在組件掛載時運行一次

    return (
        <div>
            檢查配置信息...
        </div>
    );
};

export default CustomNotification;
