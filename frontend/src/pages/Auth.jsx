import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [authMode, setAuthMode] = useState('email');
  const [role, setRole] = useState('USER');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Logged in as ${role} via ${authMode}`);
    if (role === 'ADMIN') navigate('/admin');
    else if (role === 'ORGANISER') navigate('/organiser');
    else navigate('/');
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="auth-header">
          <h2>{isLogin ? 'Welcome Back' : 'Create an Account'}</h2>
          <p>{isLogin ? 'Sign in to your account.' : 'Join ChalChitra today.'}</p>
        </div>
        
        <div className="role-selector">
          <button className={role === 'USER' ? 'active' : ''} onClick={() => setRole('USER')}>User</button>
          <button className={role === 'ORGANISER' ? 'active' : ''} onClick={() => setRole('ORGANISER')}>Host/Organiser</button>
          <button className={role === 'ADMIN' ? 'active' : ''} onClick={() => setRole('ADMIN')}>Admin</button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="John Doe" required />
            </div>
          )}
          
          <div className="auth-tabs">
            <span className={authMode === 'email' ? 'active' : ''} onClick={() => setAuthMode('email')}>Email</span>
            <span className={authMode === 'mobile' ? 'active' : ''} onClick={() => setAuthMode('mobile')}>Mobile</span>
          </div>

          {authMode === 'email' ? (
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="example@gmail.com" required />
            </div>
          ) : (
            <div className="form-group">
              <label>Mobile Number</label>
              <div className="mobile-input">
                <span className="country-code">+91</span>
                <input type="tel" placeholder="9999999999" pattern="[0-9]{10}" required />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" required />
          </div>
          
          <button type="submit" className="primary-btn auth-btn pulse-glow">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="social-auth">
          <p>Or continue with</p>
          <div className="social-buttons">
            <button className="social-btn google" onClick={() => alert('Google Auth Provider API Called')}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" />
              Google
            </button>
            <button className="social-btn facebook" onClick={() => alert('Facebook Auth Provider API Called')}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" />
              Facebook
            </button>
          </div>
        </div>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span onClick={() => setIsLogin(!isLogin)} className="auth-toggle">
              {isLogin ? 'Sign up here' : 'Log in here'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
