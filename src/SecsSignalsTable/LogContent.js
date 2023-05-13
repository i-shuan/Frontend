import React, { useState, useEffect } from 'react';

const LogContent = () => {
  const [logData, setLogData] = useState('');
  
  useEffect(() => {
    fetchLogData();
  }, []);

  const fetchLogData = async () => {
    const response = await fetch('/TAPSECS.log');
    const data = await response.text();
    setLogData(maskS7FYContent(data));
  }

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

        } else if (logLines[i].match(/S[123456890]F/)) {
            if(isMasked && countMaskLine!==0){
              isMasked = false;
            }
           
        }

        if(isMasked && timeStampRegExp.test(logLines[i])){

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


  return (
    <div>
      <pre>{logData}</pre>
    </div>
  );
};

export default LogContent;
