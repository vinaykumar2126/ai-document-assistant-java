import { useEffect, useRef } from 'react';

interface Message {
  text: string;
  isUser: boolean;
}

interface ChatBoxProps {
  messages: Message[];
}

function ChatBox({ messages }: ChatBoxProps) {
  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-box" ref={chatBoxRef}>  {/* Added ref for actual connection to div in the UI */}
      {messages.map((msg, idx) => (
        <div key={idx} className={`message ${msg.isUser ? 'user' : 'bot'}`}>
          {msg.text}
        </div>
      ))}
    </div>
  );
}

export default ChatBox;