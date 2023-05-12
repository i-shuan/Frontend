import React, { useState, useEffect } from 'react';

const LogContent = () => {
  const [logData, setLogData] = useState('');
  
  useEffect(() => {
    fetchLogData();
  }, []);

  const fetchLogData = async () => {
    const response = await fetch('/ABCDE.log');
    const data = await response.text();
    setLogData(maskS7FYContent(data));
  }

  const maskS7FYContent = (log) => {
    const logLines = log.split('\n');
    let mask = false;
    let S7FY = null;
    let result = [];

    for (let i = 0; i < logLines.length; i++) {
      if (logLines[i].includes('S7F')) {        
        mask = true;
        const s7fMatch = logLines[i].match(/S7F\d{1,2}/);

        /* Continuation of S7FY */
        if (s7fMatch && s7fMatch[0] === S7FY) {

          /*If it is to continue the same S7FY, the Mask string */
          const time = logLines[i].match(/\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}/);
          result.push(`${time[0]} - ${S7FY} ***********`);
        } else {

          /*If it isn't to continue the same S7FY, push to Log */
          S7FY = s7fMatch ? s7fMatch[0] : null;
          result.push(logLines[i]);
        }
      } else if (/\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}/.test(logLines[i])) {
        mask = false;
        S7FY = null;
      }
  
      if (!mask) {   
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
