
import { notification } from 'antd';
import "./CustomNotification.css";
import { NotificationTypeEnum, NotificationMessagesEnum } from "../../Config/ComponentsConfig/NotificationConfig"

const hasEmptyValues = (data) => {
    const isEmpty = (value) => {
        return (
            value === null ||
            value === undefined ||
            value === '' ||
            (Array.isArray(value) && value.length === 0) ||
            (typeof value === 'object' && value !== null && Object.keys(value).length === 0)
        );
    };

    if (Array.isArray(data)) {
        return data.some((value) => isEmpty(value));
    } else if (typeof data === 'object' && data !== null) {
        return Object.values(data).some((value) => isEmpty(value));
    }
    return isEmpty(data);
};

const getObjEmptyKeys = (data) => {
    const emptyKeys = Object.entries(data).filter(([key, value]) => {
        return (
            value === null ||
            value === undefined ||
            value === '' ||
            (Array.isArray(value) && value.length === 0) ||
            (typeof value === 'object' && value !== null && Object.keys(value).length === 0)
        );
    }).map(([key]) => key);

    return emptyKeys;
}

const requiredFields = (data, fields) => {
    const missingFields = fields.filter(field => {
        const value = data[field];
        return (
            value === null ||
            value === undefined ||
            value === '' ||
            (Array.isArray(value) && value.length === 0) ||
            (typeof value === 'object' && value !== null && Object.keys(value).length === 0)
        );
    });

    return missingFields;
};

export const showNotification = (messageEnum, keys = [], duration = 6) => {
    const { type, message, description } = messageEnum;
    notification[type]({
        message,
        description: typeof description === 'function' ? description(keys) : description,
        duration
    });
};

export const checkObjectValue = (data, requiredFieldsList = []) => {
    // 获取所有为空的键
    const missingObjKeys = getObjEmptyKeys(data);

    // 判断应该显示哪个错误消息
    if (missingObjKeys.length > 0) {
        // 如果有具体的配置项为空，则使用 CONFIG_ERROR
        showNotification(NotificationMessagesEnum.CONFIG_ERROR, missingObjKeys);
    } else if (hasEmptyValues(data)) {
        // 如果数据整体为空，使用 EMPTY_DATA
        showNotification(NotificationMessagesEnum.EMPTY_DATA);
    }

    // 检查必填字段
    const missingRequiredFields = requiredFields(data, requiredFieldsList);
    if (missingRequiredFields.length > 0) {
        showNotification(NotificationMessagesEnum.REQUIRED_FIELDS_MISSING, missingRequiredFields);
    }
};
