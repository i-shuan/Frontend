import React from "react";
import axios from "axios";
import { saveAs } from "file-saver";

export const DownloadFile = () => {
  const maskString = (str) => {
    // 進行遮罩處理
    // 這裡只是一個簡單的示例，您可以根據自己的需求進行調整
    return str.replace(/[aeiou]/gi, "*");
  };

    const downloadFile = async () => {
    const response = await axios({
        url: "http://localhost:5000/data", // 替換為您的API網址
        method: "POST",
        responseType: "json", // 改成期望得到json資料
    });

    console.log("response", response)
        // 現在回應的資料會在response.data.data中
        const maskedString = maskString(response.data.data);

        const blob = new Blob([maskedString], { type: "text/plain;charset=utf-8" });
        saveAs(blob, "masked_string.txt");
    };

  return <button onClick={downloadFile}>下載遮罩字串檔案</button>;
};
