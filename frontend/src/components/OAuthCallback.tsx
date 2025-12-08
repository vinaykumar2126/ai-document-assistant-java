import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface OAuthCallbackProps {
  onLoginSuccess: () => void;
}

function OAuthCallback({ onLoginSuccess }: OAuthCallbackProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const username = searchParams.get('username');

    if (token && username) {
      // Store token
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      
      console.log('OAuth login successful!');
      
      // Redirect to main app
      window.location.href = '/';
    } else {
      console.error('No token received from OAuth');
      navigate('/login?error=oauth_failed');
    }
  }, [searchParams, navigate]);

  return (
    <div className="loading-spinner">Processing OAuth login...</div>
    );
}

export default OAuthCallback;