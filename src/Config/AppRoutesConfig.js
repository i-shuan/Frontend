// src/Config/AppRoutesConfig.js
import { HomeOutlined, SettingOutlined, BulbOutlined, FolderViewOutlined } from '@ant-design/icons';
import React from 'react';


export const FileManagerTabsKeyEnum = {
    ACTION: { key: 'action', label: 'Action', requiredLevel: 1 },
    RECORD: { key: 'record', label: 'Record', requiredLevel: 2 },
    SECS_CMD: { key: 'secsCmd', label: 'Secs Cmd', requiredLevel: 3 },
};


export const TabsRoutesEnum = {
    HOME: { group: 'MAIN', label: 'HOME', path: '/', requiredLevel: 1, content: "Home Page", tabs: null },
    EDITOR: { group: 'MAIN', label: 'Editor', path: '/XmlEditor', requiredLevel: 2, content: "Editor", tabs: null },
    SECS_SIGNAL: { group: 'MAIN', label: 'SECS SIGNAL', path: '/SecsSignalsTable', requiredLevel: 3, content: "aaa", tabs: null },
    FILE_MANAGER: { group: 'MAIN', label: 'FileManager', path: '/FileManagerPage', requiredLevel: 1, content: "Secs Command Editor", tabs: FileManagerTabsKeyEnum },
};
