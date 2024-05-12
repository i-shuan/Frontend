// LogProcessor.js
import React, { useEffect, useState } from 'react';
import { Upload, Button, List, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';


// 添加 parseLog 函數於 Web Worker 的最前面
function parseLog(log) {
  const lines = log.split('\n');
  const stack = [{ value: [] }];
  let result = [];

  const listRegexp = /^<L\s*\[.*?\]\s*(.*)/;
  const othersRegexp = /^<([A-Z0-9]+)\s*\[.*?\]\s*(.*)/;
  let count = 0;

  lines.forEach(line => {
    line = line.trim();

    if (listRegexp.test(line)) {
      const newItem = { name: count++, type: 'LIST', value: [] };
      const current = stack[stack.length - 1];
      current.value.push(newItem);
      stack.push(newItem);
    } else if (othersRegexp.test(line)) {
      const tagMatch = othersRegexp.exec(line);
      if (tagMatch) {
        const type = tagMatch[1];
        let value = tagMatch[2].trim();
        value = value.replace(/>\s*$/, '').trim();
        const newItem = { name: '', type, value };
        const current = stack[stack.length - 1];
        current.value.push(newItem);
      }
    }

    if (line.endsWith('>')) {
      if (stack.length > 1) {
        stack.pop();
      }
    } else if (line === '.') {
      result = [{ name: 'LIST', type: 'LIST', value: stack[0].value }];
    }
  });

  return result.length ? result[0].value : stack[0].value;
}

function extractSxfy(logGroup) {
  // 正则表达式提取 'send Msg' 后的内容
  const match = logGroup.match(/send Msg: \[(.*?)\]/i);
  return match ? match[1] : null;
}

const LogProcessor = () => {

  const [logEntries, setLogEntries] = useState([]);
  const [logJson, setLogJson] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [allDataReceived, setAllDataReceived] = useState(false);
  console.log("logEntries len", logEntries.length)
  console.log("logEntries len", logJson)

  useEffect(() => {
    if (allDataReceived && logEntries.length !== 0) {
      const parsedJson = logEntries
        .map((log) => {
          const sxfy = extractSxfy(log);
          if (sxfy && parseInt(sxfy.slice(-2), 10) % 2 !== 0) {
            return { sxfy, secsBody: parseLog(log) };
          }
          return null;
        })
        .filter(Boolean);

      setLogJson(parsedJson);
      setProcessing(false);
      message.success('處理完成');
    }
  }, [allDataReceived])

  const startProcessing = () => {
    if (fileList.length === 0) {
      message.warning('請上傳一個檔案！');
      return;
    }

    const file = fileList[0];
    const worker = new Worker(new URL('./WebWorker.js', import.meta.url));

    worker.postMessage(file);
    setAllDataReceived(false);

    worker.onmessage = (e) => {
      if (e.data.type === 'data') {
        console.log("e.data.logEntries", e.data.logEntries)
        setLogEntries((current) => [...current, ...e.data.logEntries]);
      } else if (e.data.type === 'end') {
        setProcessing(false);
        setAllDataReceived(true);
      }
    };

    worker.onerror = (e) => {
      message.error('處理時發生錯誤: ' + e.message);
      setProcessing(false);
    };

    setProcessing(true);
    setLogEntries([]);
  };

  const uploadProps = {
    onRemove: () => {
      setFileList([]);
    },
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
    fileList,
  };

  return (
    <div>
      <Upload {...uploadProps} multiple={false} accept=".txt">
        <Button icon={<UploadOutlined />}>選擇文件</Button>
      </Upload>
      <Button
        type="primary"
        onClick={startProcessing}
        disabled={processing || fileList.length === 0}
        style={{ marginTop: '10px' }}
      >
        開始處理
      </Button>
      {processing ? (
        <p>正在處理...</p>
      ) : (
        <List
          size="small"
          header={<div>處理結果</div>}
          bordered
          dataSource={logEntries}
          renderItem={(item, index) => <List.Item key={index}>{item}</List.Item>}
          style={{ marginTop: '10px' }}
        />
      )}
    </div>
  );
};

export default LogProcessor;
