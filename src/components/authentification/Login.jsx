import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Cleanup scrollbar hiding when component unmounts
  useEffect(() => {
    return () => {
      // Restore scrollbars when leaving login page
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(formData.username, formData.password);
      // Navigation will be handled by useEffect when isAuthenticated changes
    } catch (err) {
      setError(err.message || 'Connexion échouée. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // Styles
  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #2c5530 0%, #1a3d1f 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: "'Arial', 'Helvetica', sans-serif",
    overflow: 'hidden' // Hide scrollbar on login page
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(15px)',
    border: 'none',
    borderRadius: '20px',
    boxShadow: '0 25px 50px rgba(44, 85, 48, 0.3)',
    maxWidth: '500px',
    width: '100%',
    padding: '40px 35px',
    position: 'relative',
    overflow: 'hidden'
  };

  const titleStyle = {
    color: '#1a3d1f',
    fontWeight: '800',
    fontSize: '2rem',
    marginBottom: '8px',
    textAlign: 'center',
    textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
    letterSpacing: '1px'
  };

  const subtitleStyle = {
    color: '#2c5530',
    fontSize: '1rem',
    textAlign: 'center',
    marginBottom: '10px',
    fontWeight: '600'
  };

  const clinicInfoStyle = {
    color: '#6c757d',
    fontSize: '0.85rem',
    textAlign: 'center',
    marginBottom: '30px',
    fontStyle: 'italic'
  };

  const formGroupStyle = {
    marginBottom: '25px'
  };

  const labelStyle = {
    fontWeight: '700',
    color: '#1a3d1f',
    marginBottom: '8px',
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    display: 'block'
  };

  const inputContainerStyle = {
    position: 'relative'
  };

  const iconStyle = {
    position: 'absolute',
    left: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#2c5530',
    zIndex: 10,
    pointerEvents: 'none',
    fontSize: '1rem'
  };

  const buttonStyle = {
    width: '100%',
    background: 'linear-gradient(135deg, #2c5530 0%, #1a3d1f 100%)',
    border: '2px solid #1a3d1f',
    borderRadius: '8px',
    padding: '15px 25px',
    fontWeight: '700',
    fontSize: '1rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    minHeight: '50px',
    color: 'white',
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    opacity: loading ? 0.7 : 1,
    marginTop: '15px',
    boxShadow: '0 4px 12px rgba(44, 85, 48, 0.3)'
  };

  const errorStyle = {
    background: 'rgba(220, 53, 69, 0.1)',
    border: '1px solid rgba(220, 53, 69, 0.3)',
    borderRadius: '8px',
    padding: '12px 16px',
    marginBottom: '20px',
    color: '#721c24',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  return (
    <div style={containerStyle}>
      <style>
        {`
          /* Hide scrollbars on login page */
          body {
            overflow: hidden !important;
          }

          html {
            overflow: hidden !important;
          }

          ::-webkit-scrollbar {
            display: none !important;
          }

          * {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .military-input {
            width: 100%;
            border: 2px solid #d1d5db;
            border-radius: 8px;
            padding: 15px 20px 15px 50px;
            font-size: 1rem;
            background-color: #ffffff;
            min-height: 50px;
            transition: all 0.3s ease;
            outline: none;
            box-sizing: border-box;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
            color: #1a3d1f;
          }

          .military-input:focus {
            border-color: #2c5530;
            background-color: #fff;
            box-shadow: 0 0 0 3px rgba(44, 85, 48, 0.15), inset 0 2px 4px rgba(0,0,0,0.05);
          }

          .military-input::placeholder {
            color: #9ca3af;
          }
        `}
      </style>

      <div style={cardStyle}>
        {/* Military Emblem/Logo Area */}
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #2c5530 0%, #1a3d1f 100%)',
            borderRadius: '50%',
            margin: '0 auto 15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(44, 85, 48, 0.3)',
            border: '3px solid rgba(255,255,255,0.2)'
          }}>
            <i className="fas fa-user-md" style={{ fontSize: '1.5rem', color: 'white' }}></i>
          </div>
        </div>

        <h2 style={titleStyle}>HÔPITAL MILITAIRE</h2>
        <p style={subtitleStyle}>Système de Gestion de Santé</p>
        <p style={clinicInfoStyle}>Personnel Autorisé Seulement</p>

        {error && (
          <div style={errorStyle}>
            <i className="fas fa-exclamation-triangle"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>ID de Service / Nom d'utilisateur</label>
            <div style={inputContainerStyle}>
              <i className="fas fa-id-badge" style={iconStyle}></i>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Entrez votre ID de service"
                disabled={loading}
                required
                className="military-input"
              />
            </div>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Code de Sécurité</label>
            <div style={inputContainerStyle}>
              <i className="fas fa-shield-alt" style={iconStyle}></i>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Entrez votre code de sécurité"
                disabled={loading}
                required
                className="military-input"
              />
            </div>
          </div>

          <button
            type="submit"
            style={buttonStyle}
            disabled={loading}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(44, 85, 48, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(44, 85, 48, 0.3)';
              }
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: '18px',
                  height: '18px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Authentification...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i>
                Accéder au Système
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
