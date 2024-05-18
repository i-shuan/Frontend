// store.js
import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './todo-slice';
import keycloakReducer from './keycloak-slice';

const store = configureStore({
  reducer: {
    todos: todoReducer,
    keycloak: keycloakReducer
  },
});

export default store;
