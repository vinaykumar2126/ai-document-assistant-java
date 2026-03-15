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
    <div className="chat-box" ref={chatBoxRef}>
      {messages.map((msg, idx) => (
        <div key={idx} className={`message ${msg.isUser ? 'user' : 'bot'}`}>
          <div className="message-role">{msg.isUser ? 'You' : 'Assistant'}</div>
          <div className="message-text">{msg.text}</div>
        </div>
      ))}
    </div>
  );
}

export default ChatBox;
