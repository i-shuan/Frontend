import axios from 'axios';
import { useDispatch } from 'react-redux';
import { todoActions } from './todo-slice';  // 從 todoSlice 導入整個 actions 對象

// 此函數應該在組件中調用
export const addTodoAsync = (url, text) => {
  return async (dispatch) => {
    try {
      const response = await axios({
        method: 'post', // 指定請求的 HTTP 方法為 POST
        url: url,       // 請求的 URL
        data: {         // 要發送的數據
          text: text
        }
      });
      if (response.data) {
        dispatch(todoActions.addTodo(response.data));  // 假設 response.data 是新添加的待辦事項的完整信息
      }
    } catch (error) {
      console.error("Error in addTodo", error);  // 正確記錄錯誤信息
    }
  };
};