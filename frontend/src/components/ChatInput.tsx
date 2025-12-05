import { useState } from 'react';

interface ChatInputProps {
  onSend: (text: string) => void;
}

function ChatInput({ onSend }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSendMessage = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="controls">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyUp={handleKeyPress}
        placeholder="Ask a question about the document..."
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
}

export default ChatInput;