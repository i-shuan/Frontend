import React, { useState } from 'react';
import axios from 'axios';

const DownloadFile = () => {
  const [loading, setLoading] = useState(false);

  const downloadFile = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://example.com/path/to/your/file', {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      /*Download=屬性 'file.ext'= fileName*/
      link.setAttribute('download', 'file.ext');
      
      // Check if there is an existing link with the same download attribute
      const existingLink = document.querySelector(`a[download="${link.download}"]`);
      if (existingLink) {
        // If the existing link is found, remove it from the DOM
        document.body.removeChild(existingLink);
      }
      
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={downloadFile} disabled={loading}>
        {loading ? 'Downloading...' : 'Download File'}
      </button>
    </div>
  );
};

export default DownloadFile;
