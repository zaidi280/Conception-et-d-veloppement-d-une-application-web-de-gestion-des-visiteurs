import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Perform logout
        logout();

        // Wait a moment to show the logout message
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2000);
      } catch (error) {
        console.error('Erreur de déconnexion:', error);
        // Even if there's an error, redirect to login
        navigate('/login', { replace: true });
      }
    };

    performLogout();
  }, [logout, navigate]);

  // Styles
  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #2c5530 0%, #1a3d1f 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: "'Arial', 'Helvetica', sans-serif"
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    border: 'none',
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(44, 85, 48, 0.3)',
    padding: '3rem 2.5rem',
    textAlign: 'center',
    maxWidth: '400px',
    width: '100%',
    animation: 'fadeInScale 0.5s ease'
  };

  const spinnerStyle = {
    width: '3rem',
    height: '3rem',
    border: '4px solid #e9ecef',
    borderTop: '4px solid #2c5530',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite, pulse 2s infinite',
    margin: '0 auto 2rem'
  };

  const titleStyle = {
    color: '#1a3d1f',
    fontWeight: '700',
    fontSize: '1.5rem',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px'
  };

  const messageStyle = {
    color: '#6c757d',
    fontSize: '1rem',
    margin: 0
  };

  return (
    <div style={containerStyle}>
      {/* CSS Animations */}
      <style>
        {`
          @keyframes fadeInScale {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes pulse {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.7;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }

          @media (max-width: 576px) {
            .logout-card {
              padding: 2rem 1.5rem !important;
              margin: 10px !important;
            }

            .logout-title {
              font-size: 1.25rem !important;
            }
          }
        `}
      </style>

      <div style={cardStyle} className="logout-card">
        {/* Military Emblem/Logo Area */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #2c5530 0%, #1a3d1f 100%)',
            borderRadius: '50%',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(44, 85, 48, 0.3)',
            border: '3px solid rgba(255,255,255,0.2)'
          }}>
            <i className="fas fa-hospital-alt" style={{ fontSize: '1.5rem', color: 'white' }}></i>
          </div>
        </div>

        <div style={spinnerStyle}></div>

        <h4 style={titleStyle} className="logout-title">
          <i className="fas fa-sign-out-alt"></i>
          Déconnexion en cours...
        </h4>

        <p style={messageStyle}>
          Vous êtes en cours de déconnexion. Veuillez patienter...
        </p>
      </div>
    </div>
  );
};

export default Logout;
