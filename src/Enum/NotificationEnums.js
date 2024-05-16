export const NotificationTypeEnum = {
    ERROR: 'error',
    SUCCESS: 'success'
}

export const NotificationMessagesEnum = {
    CONFIG_ERROR: {
        type: NotificationTypeEnum.ERROR,
        message: '配置錯誤',
        description: keys => `以下配置屬性為空，請檢查：${keys.join(', ')}`
    },
    CONFIG_SUCCESS: {
        type: NotificationTypeEnum.SUCCESS,
        message: '配置成功',
        description: '所有配置屬性均已正確設定。'
    },
    EMPTY_DATA: {
        type: NotificationTypeEnum.ERROR,
        message: '資料為空',
        description: '請通知負責人'
    },
    REQUIRED_FIELDS_MISSING: {
        type: NotificationTypeEnum.ERROR,
        message: '缺少必填字段',
        description: keys => `以下必填字段為空，請檢查：${keys.join(', ')}`
    }
}

export const requiredFields = ["toolID", "toolGroup", "tcsServerIp"];