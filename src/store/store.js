// store.js
import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './todo-slice';
import userProfileReducer from './userProfile-slice';
import toolViewerReducer from './toolViewer-slice';

const store = configureStore({
  reducer: {
    todos: todoReducer,
    userProfile: userProfileReducer,
    toolViewer: toolViewerReducer
  },
});

export default store;
