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
      console.log('Uploading file:', file.name);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/ai/ingest/upload', {
        method: 'POST', 
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      const result = await response.text();
      console.log('Upload response:', result);
      setStatus('success');
      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="upload-container">
      <div className="section-heading">
        <p className="eyebrow">Source material</p>
        <h3>Upload a document</h3>
        <p className="section-copy">Add one file to ground the assistant before you start chatting.</p>
      </div>

      <label htmlFor="file-upload" className="upload-label">
        <span className="upload-icon">↥</span>
        Choose Document
      </label>
      <input
        id="file-upload"
        type="file"
        onChange={uploadFile}
        accept=".pdf,.txt,.docx"
      />

      <div className="upload-hint">
        Supported formats: PDF, TXT, DOCX
      </div>

      {fileName && (
        <div className="upload-info">
          <span>Selected file</span>
          <strong>{fileName}</strong>
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
