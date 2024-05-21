//src/store/toolViewer-action.js

import { toolViewerActions } from './toolViewer-slice';

export const setActiveTabKey = (tabsKey) => {
    return async (dispatch) => {
        dispatch(toolViewerActions.setActiveTabKey(tabsKey))
    };
};