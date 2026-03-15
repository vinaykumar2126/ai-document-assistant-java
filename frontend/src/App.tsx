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
  const username = localStorage.getItem('username') || 'Explorer';

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
              <div className="app-shell">
                <aside className="app-sidebar">
                  <div className="brand-block">
                    <div className="logo-mark">AI</div>
                    <div>
                      <p className="eyebrow">Document intelligence</p>
                      <h1>AI Document Assistant</h1>
                    </div>
                  </div>

                  <div className="hero-card">
                    <p className="hero-label">Workspace</p>
                    <h2>Turn files into a fast, conversational research desk.</h2>
                    <p className="hero-copy">
                      Upload knowledge sources, ask deep questions, and get grounded answers in one clean flow.
                    </p>
                    <div className="hero-pills">
                      <span>Semantic Search</span>
                      <span>Instant Answers</span>
                      <span>Secure Access</span>
                    </div>
                  </div>

                  <div className="status-panel">
                    <div>
                      <p className="status-label">Signed in as</p>
                      <strong>{username}</strong>
                    </div>
                    <div>
                      <p className="status-label">Document status</p>
                      <strong>{isDocumentLoaded ? 'Ready to chat' : 'Waiting for upload'}</strong>
                    </div>
                    <div>
                      <p className="status-label">Conversation</p>
                      <strong>{messages.length} messages</strong>
                    </div>
                  </div>

                  <button onClick={handleLogout} className="logout-button">
                    Logout
                  </button>
                </aside>

                <main className="workspace">
                  <header className="workspace-header">
                    <div>
                      <p className="eyebrow">Knowledge cockpit</p>
                      <h2>{isDocumentLoaded ? 'Ask better questions, faster.' : 'Start with a document upload.'}</h2>
                    </div>
                    <div className="header-badge">
                      <span className={`badge-dot ${isDocumentLoaded ? 'active' : ''}`}></span>
                      {isDocumentLoaded ? 'Live workspace' : 'Awaiting source file'}
                    </div>
                  </header>

                  <section className="workspace-grid">
                    <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
                      <FileUpload onUploadSuccess={() => setIsDocumentLoaded(true)} />
                    </Suspense>

                    <section className="chat-panel">
                      {isDocumentLoaded ? (
                        <>
                          <div className="chat-panel-header">
                            <div>
                              <p className="eyebrow">Conversation</p>
                              <h3>Document chat</h3>
                            </div>
                            <div className="chat-meta">
                              <span>{messages.filter((message) => message.isUser).length} prompts</span>
                              <span>{messages.filter((message) => !message.isUser).length} responses</span>
                            </div>
                          </div>

                          <Suspense fallback={<div className="loading-spinner">Loading chat...</div>}>
                            <ChatBox messages={messages} />
                          </Suspense>

                          <Suspense fallback={<div className="loading-spinner">Loading input...</div>}>
                            <ChatInput onSend={handleSendMessage} />
                          </Suspense>
                        </>
                      ) : (
                        <div className="empty-state">
                          <div className="empty-orb"></div>
                          <div className="empty-icon">✦</div>
                          <h3>Your AI reading room is ready</h3>
                          <p>Drop in a PDF, text file, or DOCX to unlock grounded chat, summaries, and quick lookups.</p>
                        </div>
                      )}
                    </section>
                  </section>
                </main>
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
