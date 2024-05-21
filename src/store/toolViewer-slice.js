// src/store/toolViewer-slice.js
import { createSlice } from '@reduxjs/toolkit';
import { FileManagerTabsKeyEnum } from '../Config/TabsConfig/FileManagerTabsConfig';

const initialState = {
    activeTabKey: FileManagerTabsKeyEnum.FILE_MANAGER,
};

const toolViewerSlice = createSlice({
    name: 'toolViewer',
    initialState,
    reducers: {
        setActiveTabKey: (state, action) => {
            state.activeTabKey = action.payload;
        },
    },
});

export const toolViewerActions = toolViewerSlice.actions;
export default toolViewerSlice.reducer;
