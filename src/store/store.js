// store.js
import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './todo-slice';
import userProfileReducer from './userProfile-slice';
const store = configureStore({
  reducer: {
    todos: todoReducer,
    userProfile: userProfileReducer
  },
});

export default store;
