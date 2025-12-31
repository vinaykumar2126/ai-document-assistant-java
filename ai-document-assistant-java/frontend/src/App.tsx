import { useState, lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/App.css';

const FileUpload = lazy(() => import('./components/FileUpload'));
const ChatBox = lazy(() => import('./components/ChatBox'));
const ChatInput = lazy(() => import('./components/ChatInput'));
const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register')); // ← ADD THIS
const OAuthCallback = lazy(() => import('./components/OAuthCallback'));

interface Message {
  text: string;
  isUser: boolean;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isDocumentLoaded, setIsDocumentLoaded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Token found in localStorage - auto-login');
      setIsLoggedIn(true);
    } else {
      console.log('No token found - showing login');
      setIsLoggedIn(false);
    }
    setIsCheckingAuth(false);
  }, []);

  const handleSendMessage = async (question: string) => {
    setMessages(prev => [...prev, { text: question, isUser: true }]);
    setMessages(prev => [...prev, { text: 'Thinking...', isUser: false }]);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/ai/ask?question=${encodeURIComponent(question)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
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
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setMessages([]);
    setIsDocumentLoaded(false);
  };

  if (isCheckingAuth) {
    return <div className="loading-spinner">Checking authentication...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* OAuth Callback Route */}
        <Route path="/oauth-callback" element={
          <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
            <OAuthCallback onLoginSuccess={() => setIsLoggedIn(true)} />
          </Suspense>
        } />

        {/* ✅ ADD REGISTER ROUTE */}
        <Route path="/register" element={
          isLoggedIn ? (
            <Navigate to="/" replace />
          ) : (
            <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
              <Register onRegisterSuccess={() => setIsLoggedIn(true)} />
            </Suspense>
          )
        } />

        {/* Login Route */}
        <Route path="/login" element={
          isLoggedIn ? (
            <Navigate to="/" replace />
          ) : (
            <Suspense fallback={<div className="loading-spinner">Loading login...</div>}>
              <Login onLoginSuccess={() => setIsLoggedIn(true)} />
            </Suspense>
          )
        } />

        {/* Main App Route */}
        <Route path="/" element={
          !isLoggedIn ? (
            <Navigate to="/login" replace />
          ) : (
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
          )
        } />

        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;