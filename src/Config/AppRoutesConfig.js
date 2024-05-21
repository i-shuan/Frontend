// src/Config/AppRoutesConfig.js
import { HomeOutlined, SettingOutlined, BulbOutlined, FolderViewOutlined } from '@ant-design/icons';
import React from 'react';
import { FileManagerTabsKeyEnum } from './TabsConfig/FileManagerTabsConfig';

export const TabsRoutesEnum = {
    HOME: { label: 'HOME', path: '/', tabs: null },
    EDITOR: { label: 'Editor', path: '/XmlEditor', tabs: null },
    SECS_SIGNAL: { label: 'SECS SIGNAL', path: '/SecsSignalsTable', tabs: null },
    FILE_MANAGER: { label: 'FileManager', path: '/FileManagerPage', tabs: FileManagerTabsKeyEnum },
};
