
import { userProfileActions } from './userProfile-slice';


export const setUserInfo = (info) => {
    return async (dispatch) => {
        dispatch(userProfileActions.setUserInfo(info))
    };
}


export const setDefaultUserLevel = (level) => {
    return async (dispatch) => {
        dispatch(userProfileActions.setDefaultUserLevel(level))
    };
}


export const setSimulatedLevel = (level) => {
    return async (dispatch) => {
        dispatch(userProfileActions.setSimulatedLevel(level))
    };
}


export const resetUserProfileState = () => {
    return async (dispatch) => {
        dispatch(userProfileActions.resetUserProfileState())
    };
}