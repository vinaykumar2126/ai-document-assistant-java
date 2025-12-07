import { useState, lazy, Suspense, useEffect } from 'react';
import './styles/App.css';

const FileUpload = lazy(() => import('./components/FileUpload'));
const ChatBox = lazy(() => import('./components/ChatBox'));
const ChatInput = lazy(() => import('./components/ChatInput'));
const Login = lazy(() => import('./components/Login'));

interface Message {
  text: string;
  isUser: boolean;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isDocumentLoaded, setIsDocumentLoaded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);  // Loading state

  // ✅ CHECK TOKEN ON APP LOAD (AUTO-LOGIN)
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Token exists! User is already logged in
      console.log('Token found in localStorage - auto-login');
      setIsLoggedIn(true);
    } else {
      // No token, user needs to log in
      console.log('No token found - showing login');
      setIsLoggedIn(false);
    }
    setIsCheckingAuth(false);  // Done checking
  }, []);

  const handleSendMessage = async (question: string) => {
    setMessages(prev => [...prev, { text: question, isUser: true }]);
    setMessages(prev => [...prev, { text: 'Thinking...', isUser: false }]);

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:8080/api/ai/ask?question=${encodeURIComponent(question)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        // ✅ Token expired or invalid
        if (response.status === 401) {
          localStorage.removeItem('authToken');
          setIsLoggedIn(false);  // Force re-login
          return;
        }
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const answer = await response.text();

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

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setMessages([]);
    setIsDocumentLoaded(false);
  };

  // Show loading while checking auth
  if (isCheckingAuth) {
    return <div className="loading-spinner">Checking authentication...</div>;
  }

  // Show login if not logged in
  if (!isLoggedIn) {
    return (
      <Suspense fallback={<div className="loading-spinner">Loading login...</div>}>
        <Login onLoginSuccess={() => setIsLoggedIn(true)} />
      </Suspense>
    );
  }

  // Show main app if logged in
  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">
          <span className="logo-icon">📚</span>
          <h1>AI Document Assistant</h1>
        </div>
        <p className="tagline">Chat with your documents using AI</p>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
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
        ) : (
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