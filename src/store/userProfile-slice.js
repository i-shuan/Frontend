import { createSlice } from '@reduxjs/toolkit';
import { levelKeys } from '../Config/UserProfileConfig';

const initialState = {
    userInfo: null,
    defaultUserLevel: 0, // 用於確定用戶權限的參數
    simulatedLevel: 0 // 只有 S 級用戶可以模擬其他級別
};

const userProfileSlice = createSlice({
    name: 'userProfile',
    initialState,
    reducers: {
        setUserInfo(state, action) {
            state.userInfo = action.payload;
            console.log("setUserInfo: ", state.userInfo);
        },
        setDefaultUserLevel(state, action) {
            state.defaultUserLevel = action.payload;
            state.simulatedLevel = action.payload;
            console.log("setDefaultUserLevel: ", state.defaultUserLevel);
        },
        setSimulatedLevel(state, action) {
            if (state.defaultUserLevel === levelKeys.S) {
                state.simulatedLevel = action.payload;
            }
            console.log("setSimulatedLevel: ", state.simulatedLevel);
        },
        resetUserProfileState(state) {
            state.userInfo = initialState.userInfo;
            state.defaultUserLevel = initialState.defaultUserLevel;
            state.simulatedLevel = initialState.simulatedLevel;
            console.log("resetUserProfileState: ", state);
        }
    },
});

export const userProfileActions = userProfileSlice.actions;
export default userProfileSlice.reducer;
