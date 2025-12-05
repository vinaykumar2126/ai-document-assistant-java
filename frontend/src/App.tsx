import { useState } from 'react'

interface Message{
  text: string;
  isUser: boolean;
}

function App() {
  const [status, setStatus] = useState('')
  const [selectedFile,setSelectedFile] = useState<File | null>(null);


  const handleFileSelect = (e:React.ChangeEvent<HTMLInputElement>)=>{
    const file = e.target.files?.[0] || null;

    if (file){
      setSelectedFile(file);
    }
 }
  const uploadFile = async()=>{
    if(!selectedFile){
      setStatus('Please select a file first');
      return;
    }

    setStatus('Uploading...');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try{
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await response.text();

      setStatus(`Upload successful: ${result}`);
      
    }catch(error){
      setStatus('Upload failed');
      console.error('Error uploading file:', error);
    }
  }

  return (
    <div>
      <h2>🤖 Chat with Your Documents</h2>
      <input type = "file" onChange={handleFileSelect} />
      <button onClick={uploadFile}>Upload</button>
      <p>{status}</p>
    </div>
  )
}

export default App
