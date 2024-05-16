import axios from 'axios';
import { useDispatch } from 'react-redux';
import { todoActions } from './todo-slice';  // 從 todoSlice 導入整個 actions 對象
import { checkObjectValue } from "../Utils/Notification/CustomNotification"
// 此函數應該在組件中調用
export const addTodoAsync = (url, text) => {
  return async (dispatch) => {
    if (!text) {
      checkObjectValue(text)
      console.error("No text provided for the todo.");
      return; // 仍返回一個 thunk 函數，但不進行任何操作
    }
    try {
      const response = await axios({
        method: 'post',
        url: url,
        data: { text }
      });
      if (response.data) {
        dispatch(todoActions.addTodo(response.data));
      }
    } catch (error) {
      console.error("Error in addTodoAsync", error);
    }
  };
};