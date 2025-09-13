import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import Chatbot from '../Chatbot/Chatbot';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate('/logout');
  };

  // Styles
  const sidebarStyle = {
    position: 'fixed',
    left: 0,
    top: 0,
    width: '280px',
    height: '100vh',
    background: 'linear-gradient(180deg, #2c5530 0%, #1a3d1f 100%)',
    boxShadow: '2px 0 10px rgba(44, 85, 48, 0.3)',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column'
  };

  const sidebarHeaderStyle = {
    padding: '25px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  };

  const brandStyle = {
    color: 'white',
    fontSize: '1.4rem',
    fontWeight: '700',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '15px'
  };

  const headerUserInfoStyle = {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    paddingLeft: '4px'
  };

  const sidebarNavStyle = {
    flex: 1,
    padding: '20px 0'
  };

  const navLinkStyle = {
    color: 'rgba(255, 255, 255, 0.9)',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    padding: '15px 25px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    transition: 'all 0.3s ease',
    borderLeft: '3px solid transparent'
  };

  const activeNavLinkStyle = {
    ...navLinkStyle,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderLeftColor: 'white',
    color: 'white'
  };

  const sidebarFooterStyle = {
    padding: '25px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
  };

  const logoutButtonStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    color: 'white',
    padding: '12px 20px',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    justifyContent: 'center'
  };

  const mainContentStyle = {
    marginLeft: '280px',
    minHeight: '100vh',
    backgroundColor: '#f5f7fa'
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div>
      {/* CSS for responsive design and full width */}
      <style>
        {`
          * {
            box-sizing: border-box !important;
          }
          
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100vw !important;
            overflow-x: hidden !important;
          }
          
          #root {
            margin: 0 !important;
            padding: 0 !important;
            width: 100vw !important;
          }
          
          .container, .container-fluid, .container-sm, .container-md, .container-lg, .container-xl, .container-xxl {
            margin: 0 !important;
            padding: 0 !important;
            max-width: none !important;
            width: 100% !important;
          }
          
          .row {
            margin: 0 !important;
            width: 100% !important;
          }
          
          .col, .col-1, .col-2, .col-3, .col-4, .col-5, .col-6, .col-7, .col-8, .col-9, .col-10, .col-11, .col-12,
          .col-sm, .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12,
          .col-md, .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12,
          .col-lg, .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12,
          .col-xl, .col-xl-1, .col-xl-2, .col-xl-3, .col-xl-4, .col-xl-5, .col-xl-6, .col-xl-7, .col-xl-8, .col-xl-9, .col-xl-10, .col-xl-11, .col-xl-12 {
            padding: 0 !important;
          }
          
          @media (max-width: 768px) {
            .sidebar {
              width: 250px !important;
            }
            .main-content {
              margin-left: 250px !important;
            }
          }
          
          @media (max-width: 480px) {
            .sidebar {
              width: 100% !important;
              transform: translateX(-100%) !important;
              transition: transform 0.3s ease !important;
            }
            .sidebar.open {
              transform: translateX(0) !important;
            }
            .main-content {
              margin-left: 0 !important;
            }
          }
        `}
      </style>

      {/* Sidebar Navigation */}
      <div style={sidebarStyle} className="sidebar">
        {/* Sidebar Header */}
        <div style={sidebarHeaderStyle}>
          <a href="#" style={brandStyle}>
            <i className="fas fa-hospital-alt"></i>
            Hôpital Militaire
          </a>
          <div style={headerUserInfoStyle}>
            <i className="fas fa-user-circle"></i>
            Bienvenue, {user?.username || 'Utilisateur'}
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav style={sidebarNavStyle}>
          <a 
            href="/dashboard" 
            style={isActive('/dashboard') ? activeNavLinkStyle : navLinkStyle}
            onMouseEnter={(e) => {
              if (!isActive('/dashboard')) {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive('/dashboard')) {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
          >
            <i className="fas fa-tachometer-alt"></i>
            Tableau de Bord
          </a>
          <a
            href="/visiteurs"
            style={isActive('/visiteurs') ? activeNavLinkStyle : navLinkStyle}
            onMouseEnter={(e) => {
              if (!isActive('/visiteurs')) {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive('/visiteurs')) {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
          >
            <i className="fas fa-users"></i>
            Visiteurs
          </a>
          
          
          
          {/* <a 
            href="#appointments" 
            style={navLinkStyle}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            <i className="fas fa-calendar-alt"></i>
            Rendez-vous
          </a> */}
          
          {/* <a 
            href="#medical-records" 
            style={navLinkStyle}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            <i className="fas fa-file-medical"></i>
            Dossiers Médicaux
          </a>
          
          <a 
            href="#reports" 
            style={navLinkStyle}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            <i className="fas fa-chart-bar"></i>
            Rapports
          </a> */}
        </nav>

        {/* Sidebar Footer */}
        <div style={sidebarFooterStyle}>
          <button 
            style={logoutButtonStyle}
            onClick={handleLogout}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }}
          >
            <i className="fas fa-sign-out-alt"></i>
            Déconnexion
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={mainContentStyle} className="main-content">
        {children}
      </div>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default Layout;
