import React from 'react';
import { HomeOutlined, SettingOutlined, BulbOutlined, FolderViewOutlined } from '@ant-design/icons';
import HomePage from '../../HomePage/LandingPage';
import FileManagerPage from '../../FileManagerPage/FileManagerPage';
import XmlEditor from '../../EditorPage/XmlEditor';
import SecsSignalsTable from '../../SecsSignalsTable/SecsSignalsTable';
import { TabsRoutesEnum } from '../AppRoutesConfig';

const routeComponents = {
    HOME: HomePage,
    Editor: XmlEditor,
    'SECS SIGNAL': SecsSignalsTable,
    FileManager: FileManagerPage,
};

const RoutesConfig = Object.values(TabsRoutesEnum).map(route => ({
    group: route.group,
    icon: route.label === 'HOME' ? <HomeOutlined /> :
        route.label === 'Editor' ? <SettingOutlined /> :
            route.label === 'SECS SIGNAL' ? <BulbOutlined /> :
                route.label === 'FileManager' ? <FolderViewOutlined /> : null,
    title: route.label,
    component: routeComponents[route.label],
    path: route.path,
    content: route.content,
    requiredLevel: route.requiredLevel,
}));

export default RoutesConfig;
