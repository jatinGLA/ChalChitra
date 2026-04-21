import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../supabase';
import { API_BASE_URL } from '../config';
import './Auth.css';

const Auth = () => {
  // States
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminPortal, setIsAdminPortal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authMode, setAuthMode] = useState('email'); // 'email' or 'mobile'
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    query: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errorMSG, setErrorMSG] = useState('');
  const [successMSG, setSuccessMSG] = useState('');
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) setErrorMSG(error.message);
  };

  const handleHostRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMSG('');
    setSuccessMSG('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          query: formData.query
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Request failed');
      
      setSuccessMSG('Your query has been submitted! Our team will contact you shortly to provide your Host ID.');
      setTimeout(() => setIsRequestModalOpen(false), 3000);
    } catch (error) {
      setErrorMSG(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMSG('');
    
    try {
      const endpoint = isLogin ? `${API_BASE_URL}/api/auth/login` : `${API_BASE_URL}/api/auth/register`;
      
      const payload = {
        password: formData.password
      };

      if (!isLogin) {
        payload.name = formData.name;
        // User signups automatically get assigned 'USER' role
        payload.role = 'USER';
      }
      
      if (authMode === 'email') {
        payload.email = formData.email;
      } else {
        payload.phone = formData.phone;
        payload.email = formData.phone + "@mobile.com"; // dummy email fallback for phone
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      // Store token
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));

      // Redirect dynamically: Follow redirect param if exists, otherwise use role-based logic
      if (redirectPath && data.role === 'USER') {
        navigate(redirectPath);
      } else {
        const userRole = data.role;
        if (userRole === 'ADMIN') navigate('/admin');
        else if (userRole === 'ORGANISER') navigate('/organiser');
        else navigate('/');
      }
      
    } catch (error) {
      console.error('Auth error:', error);
      setErrorMSG(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Switch to Admin strict login view
  const toggleAdminPortal = () => {
    setIsAdminPortal(!isAdminPortal);
    // Force Login mode if entering Admin Portal
    if (!isAdminPortal) setIsLogin(true);
  };

  return (
    <div className="auth-page">
      <div className="auth-card-container">
        <div className="auth-card">
          
          <div className="auth-header-wrapper">
            <h2>{isAdminPortal ? 'Host & Admin Portal' : (isLogin ? 'Welcome Back' : 'Create an Account')}</h2>
            <p>
              {isAdminPortal 
                ? 'Sign in to access your administrative dashboard.'
                : (isLogin ? 'Sign in to book your tickets and explore.' : 'Join ChalChitra to get started.')}
            </p>
          </div>

          {errorMSG && <div className="error-msg">{errorMSG}</div>}

          {/* Toggle Login/Sign Up ONLY if not in Admin Portal */}
          {!isAdminPortal && (
            <div className="auth-mode-switch">
              <div className={`auth-mode-pill ${isLogin ? 'login-mode' : 'register-mode'}`}></div>
              <button 
                type="button" 
                className={isLogin ? 'active' : ''} 
                onClick={() => setIsLogin(true)}
              >
                Log In
              </button>
              <button 
                type="button" 
                className={!isLogin ? 'active' : ''} 
                onClick={() => setIsLogin(false)}
              >
                Sign Up
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form-animated">
            
            {/* Show Full Name only on Sign Up */}
            {!isLogin && (
              <div className="input-group fade-scale-enter">
                <label>Full Name</label>
                <input 
                  className="auth-input" 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  placeholder="John Doe" 
                  required 
                />
              </div>
            )}
            
            <div className="input-group fade-scale-enter" style={{animationDelay: '0.1s'}}>
              <label>Email Address</label>
              <input 
                className="auth-input" 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                placeholder="you@example.com" 
                required 
              />
            </div>

            <div className="input-group fade-scale-enter" style={{animationDelay: '0.2s', position: 'relative'}}>
              <label>Password</label>
              <div className="password-input-wrapper" style={{position: 'relative'}}>
                <input 
                  className="auth-input" 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  value={formData.password} 
                  onChange={handleInputChange} 
                  placeholder="••••••••" 
                  required 
                  style={{paddingRight: '45px'}}
                />
                <button 
                  type="button" 
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '18px',
                    opacity: '0.6',
                    padding: '5px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title={showPassword ? "Hide Password" : "Show Password"}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          {/* Only show OAuth for standard users */}
          {!isAdminPortal && (
            <>
              <div className="divider">or</div>
              <button onClick={handleGoogleLogin} type="button" className="google-btn">
                <svg className="google-icon" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </>
          )}

          <div className="admin-login-link">
            {isAdminPortal ? (
              <>
                <p style={{marginBottom: '10px'}}>
                  <span onClick={() => { setIsRequestModalOpen(true); setErrorMSG(''); setSuccessMSG(''); }} style={{color: 'var(--primary-color)', cursor: 'pointer', fontWeight: '600'}}>Want to host an event? Request an ID</span>
                </p>
                <div 
                  onClick={toggleAdminPortal} 
                  style={{
                    marginTop: '15px', 
                    padding: '8px', 
                    borderRadius: '8px', 
                    background: 'rgba(255,255,255,0.05)', 
                    cursor: 'pointer',
                    fontSize: '14px',
                    display: 'inline-block'
                  }}
                >
                  &larr; Back to User Login
                </div> 
              </>
            ) : (
              <div 
                className="admin-portal-trigger" 
                onClick={toggleAdminPortal}
                style={{
                  border: '1px solid var(--primary-color)',
                  color: 'var(--primary-color)',
                  padding: '10px 20px',
                  borderRadius: '12px',
                  marginTop: '10px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  background: 'rgba(239, 68, 68, 0.05)'
                }}
              >
                🔐 Are you a Host or Admin? Sign in here
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Host Request Modal Overlay */}
      {isRequestModalOpen && (
        <div className="modal-overlay" onClick={() => setIsRequestModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="auth-header-wrapper" style={{marginBottom: '20px'}}>
              <h2>Partner With Us</h2>
              <p>Submit your query to host an event on ChalChitra.</p>
            </div>
            
            {successMSG && <div className="success-msg">{successMSG}</div>}
            {errorMSG && <div className="error-msg">{errorMSG}</div>}

            {!successMSG && (
               <form onSubmit={handleHostRequest} className="auth-form-animated">
                 <div className="input-group">
                   <label>Contact Name</label>
                   <input className="auth-input" type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                 </div>
                 <div className="input-group">
                   <label>Email Address</label>
                   <input className="auth-input" type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                 </div>
                 <div className="input-group">
                   <label>Phone Number (Optional)</label>
                   <input className="auth-input" type="tel" name="phone" value={formData.phone} onChange={handleInputChange} />
                 </div>
                 <div className="input-group">
                   <label>Describe your Event / Query</label>
                   <textarea className="auth-input" name="query" value={formData.query} onChange={handleInputChange} rows="4" required style={{resize: 'none'}} />
                 </div>
                 <button type="submit" className="submit-btn" disabled={loading}>
                   {loading ? 'Submitting...' : 'Submit Request'}
                 </button>
                 <button type="button" className="cancel-btn" onClick={() => setIsRequestModalOpen(false)}>Cancel</button>
               </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;
