import React from "react";
import axios from "axios";
import { saveAs } from "file-saver";

const maskS7FYContent = (log) => {
    const logLines = log.split('\n');
    let isMasked = false;
    let lastS7FY = null;
    let result = [];
    let countMaskLine = 0;
    const timeStampRegExp = /\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}/;

    for (let i = 0; i < logLines.length; i++) {   
        if (logLines[i].includes('S7F')) {               
            isMasked = true;       
            const s7fMatch = logLines[i].match(/S7F\d{1,2}/);
            const time = logLines[i].match(timeStampRegExp);
            if(s7fMatch !== lastS7FY){
                countMaskLine = 0;
                lastS7FY = s7fMatch;
            }
            result.push(`${time[0]} - ${s7fMatch} ***********`);
            continue;

        } else if (logLines[i].match(timeStampRegExp)) {
            if(isMasked){
              isMasked = false;
            }
           
        }

        if(isMasked){

            const time = logLines[i].match(timeStampRegExp);
            result.push(`${time[0]} - ******Content*****`);     
        }
        else if(!isMasked){
          result.push(logLines[i]);
        }

        countMaskLine = isMasked? countMaskLine+1: countMaskLine;
    }

    return result.join('\n');
};
export const DownloadFile = async () => {
    

    const downloadFile = async () => {
        const response = await axios({
            url: "http://localhost:5000/api/test", // 替換為您的API網址
            method: "POST",
            responseType: "blob", // 改成期望得到json資料,
            data:{"filename": "TAPSECS.log"}
        });

        console.log("response", response)
        // // 現在回應的資料會在response.data.data中
        // const maskedString = maskS7FYContent(response.data.data);

        // const blob = new Blob([maskedString], { type: "text/plain;charset=utf-8" });
        // saveAs(blob, "masked_string.txt");
        if(response.status===200){
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'file.txt'); // or any other extension
            document.body.appendChild(link);
            link.click();
        }
    };

  return <button onClick={downloadFile}>下載遮罩字串檔案</button>;
};
