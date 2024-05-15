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
    }
}