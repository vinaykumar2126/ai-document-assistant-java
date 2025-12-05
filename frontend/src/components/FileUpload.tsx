import { useState } from 'react';

interface FileUploadProps {
  onUploadSuccess?: () => void;
}

function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [status, setStatus] = useState('');
  const [fileName, setFileName] = useState('');

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setStatus('processing');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8080/api/ai/ingest/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await response.text();
      setStatus('success');
      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="upload-container">
      <label htmlFor="file-upload" className="upload-label">
        📁 Choose Document
      </label>
      <input
        id="file-upload"
        type="file"
        onChange={uploadFile}
        accept=".pdf,.txt,.docx"
      />
      
      {fileName && (
        <div className="upload-info">
          Selected: <strong>{fileName}</strong>
        </div>
      )}
      
      {status && (
        <div className={`status ${status}`}>
          {status === 'processing' && '⏳ Processing document...'}
          {status === 'success' && '✅ Document uploaded successfully!'}
          {status === 'error' && '❌ Upload failed. Please try again.'}
        </div>
      )}
    </div>
  );
}

export default FileUpload;