import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    initialized: false,
    userInfo: null,
    error: null,
};

const keycloakSlice = createSlice({
    name: 'keycloak',
    initialState,
    reducers: {
        setInitialized(state, action) {
            state.initialized = action.payload;
        },
        setUserInfo(state, action) {
            state.userInfo = action.payload;
            console.log("state.userInfo", state.userInfo)
        },
        setError(state, action) {
            state.error = action.payload;
        },
        clearUserInfo(state) {
            state.userInfo = null;
        }
    },
});

export const keycloakActions = keycloakSlice.actions;
export default keycloakSlice.reducer;
