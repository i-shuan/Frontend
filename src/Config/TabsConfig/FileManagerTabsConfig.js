// src/Enum/TabsRoutesEnum.js
import { HomeOutlined, SettingOutlined, BulbOutlined, FolderViewOutlined, AppstoreOutlined, ReadOutlined } from '@ant-design/icons';
import { FileManagerTabsKeyEnum } from "../AppRoutesConfig";
import GridExample from "../../FileManagerPage/GridExample"
export const FileManagerTabs = {
    [FileManagerTabsKeyEnum.ACTION.key]: { label: FileManagerTabsKeyEnum.ACTION.label, icon: <AppstoreOutlined />, content: <div>Action Content</div> },
    [FileManagerTabsKeyEnum.RECORD.key]: { label: FileManagerTabsKeyEnum.RECORD.label, icon: <ReadOutlined />, content: <div>Record Content</div> },
    [FileManagerTabsKeyEnum.SECS_CMD.key]: { label: FileManagerTabsKeyEnum.SECS_CMD.label, icon: <SettingOutlined />, content: <GridExample /> }
};
