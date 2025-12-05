import { useState, lazy, Suspense } from 'react';
import './styles/App.css';

const FileUpload = lazy(() => import('./components/FileUpload'));
const ChatBox = lazy(() => import('./components/ChatBox'));
const ChatInput = lazy(() => import('./components/ChatInput'));

interface Message {
  text: string;
  isUser: boolean;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isDocumentLoaded, setIsDocumentLoaded] = useState(false);

  const handleSendMessage = async (question: string) => {
    // Add user's message to the chat
    setMessages(prev => [...prev, { text: question, isUser: true }]);

    // Add a temporary "Thinking..." message from the bot
    setMessages(prev => [...prev, { text: 'Thinking...', isUser: false }]);

    try {
      // Fetch the real answer from the API
      const response = await fetch(`http://localhost:8080/api/ai/ask?question=${encodeURIComponent(question)}`);
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const answer = await response.text();

      // Replace "Thinking..." with the actual answer
      setMessages(prev => {
        const updatedMessages = [...prev];
        const lastMessageIndex = updatedMessages.length - 1;
        if (lastMessageIndex >= 0 && updatedMessages[lastMessageIndex].text === 'Thinking...') {
          updatedMessages[lastMessageIndex] = { text: answer, isUser: false };
        }
        return updatedMessages;
      });

    } catch (error) {
      console.error("Error fetching AI response:", error);
      // If there's an error, update the message to show it
      setMessages(prev => {
        const updatedMessages = [...prev];
        const lastMessageIndex = updatedMessages.length - 1;
        if (lastMessageIndex >= 0 && updatedMessages[lastMessageIndex].text === 'Thinking...') {
          updatedMessages[lastMessageIndex] = { text: 'Error: Could not get a response.', isUser: false };
        }
        return updatedMessages;
      });
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">
          <span className="logo-icon">📚</span>
          <h1>AI Document Assistant</h1>
        </div>
        <p className="tagline">Chat with your documents using AI</p>
      </header>

      <div className="container">
        <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
          <FileUpload onUploadSuccess={() => setIsDocumentLoaded(true)} />
        </Suspense>

        {isDocumentLoaded ? (
          <>
            <Suspense fallback={<div className="loading-spinner">Loading chat...</div>}>
              <ChatBox messages={messages} />
            </Suspense>

            <Suspense fallback={<div className="loading-spinner">Loading input...</div>}>
              <ChatInput onSend={handleSendMessage} />
            </Suspense>
          </>
        ):(
          <div className="empty-state">
            <div className="empty-icon">📄</div>
            <h3>No document uploaded yet</h3>
            <p>Upload a document to start chatting with AI</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;