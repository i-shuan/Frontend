// WebWorker.js
/* eslint-disable no-restricted-globals */

self.onmessage = function (e) {
    const file = e.data;
    const reader = new FileReader();
    let position = 0;
    const chunkSize = 1024 * 1024; // 每次處理 1MB
  
    reader.onload = function (event) {
      const text = event.target.result;
      const pattern = /send Msg: \[S\d+F\d+\].*?\n\./gis;
      const logEntries = text.match(pattern) || [];
      self.postMessage({ type: 'data', logEntries });
  
      position += chunkSize;
      if (position < file.size) {
        processNextChunk();
      } else {
        self.postMessage({ type: 'end' });
      }
    };
  
    reader.onerror = function () {
      self.postMessage({ type: 'error', message: reader.error });
    };
  
    function processNextChunk() {
      const blob = file.slice(position, position + chunkSize);
      reader.readAsText(blob);
    }
  
    processNextChunk();
  };
  
  self.onerror = function (err) {
    self.postMessage({ type: 'error', message: err.message });
  };
  