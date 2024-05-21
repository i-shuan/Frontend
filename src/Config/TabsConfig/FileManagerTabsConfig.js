// src/Enum/TabsRoutesEnum.js
import { HomeOutlined, SettingOutlined, BulbOutlined, FolderViewOutlined, AppstoreOutlined, ReadOutlined } from '@ant-design/icons';

export const FileManagerTabsKeyEnum = {
    ACTION: { key: 'action', label: 'Action' },
    RECORD: { key: 'record', label: 'Record' },
    SECS_CMD: { key: 'secsCmd', label: 'Secs Cmd' },
};

export const FileManagerTabs = {
    [FileManagerTabsKeyEnum.ACTION.key]: { label: FileManagerTabsKeyEnum.ACTION.label, icon: <AppstoreOutlined />, content: <div>Action Content</div> },
    [FileManagerTabsKeyEnum.RECORD.key]: { label: FileManagerTabsKeyEnum.RECORD.label, icon: <ReadOutlined />, content: <div>Record Content</div> },
    [FileManagerTabsKeyEnum.SECS_CMD.key]: { label: FileManagerTabsKeyEnum.SECS_CMD.label, icon: <SettingOutlined />, content: <div>Secs Cmd Content</div> }
};
