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
    var timeStampRegExp = /\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}/;
    for (let i = 0; i < logLines.length; i++) {
      if (logLines[i].includes('S7F')) {               
        isMasked = true;       
        const s7fMatch = logLines[i].match(/S7F\d{1,2}/);
        
        const time = logLines[i].match(timeStampRegExp);

        if(s7fMatch !== lastS7FY){
          /* Different S7FY => Reset Count */   
          countMaskLine = 0;
          lastS7FY = s7fMatch
        }
        result.push(`${time[0]} - ${s7fMatch} ***********`);
        continue;

      } else if (timeStampRegExp.test(logLines[i])) {
       
        /* lastS7FY countent*/
        if(isMasked && countMaskLine === 0){
          const time = logLines[i].match(/\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}/);
          result.push(`${time[0]} - ***** Content ******`);
        }
        else{
          isMasked = false;
          lastS7FY = null
          countMaskLine = 0;
        }
        countMaskLine = isMasked? countMaskLine+1:countMaskLine;
      }
      
      if(!isMasked){
        result.push(logLines[i]);
      }
     
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
