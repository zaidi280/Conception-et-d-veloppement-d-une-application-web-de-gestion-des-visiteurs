import React from 'react';

const ChatbotIcon = ({ isOpen, onToggle, hasUnreadMessages }) => {
  const iconStyle = {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: isOpen 
      ? 'linear-gradient(135deg, #2c5530 0%, #1a3d1f 100%)'
      : 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
    boxShadow: '0 4px 20px rgba(76, 175, 80, 0.4)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    transition: 'all 0.3s ease',
    border: 'none',
    outline: 'none',
    fontSize: '24px',
    color: 'white',
    transform: isOpen ? 'scale(1.1)' : 'scale(1)',
  };

  const notificationStyle = {
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: '#ff4444',
    color: 'white',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    animation: hasUnreadMessages ? 'pulse 2s infinite' : 'none',
  };

  const pulseAnimation = `
    @keyframes pulse {
      0% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.2);
        opacity: 0.8;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }
  `;

  return (
    <>
      <style>{pulseAnimation}</style>
      <button
        style={iconStyle}
        onClick={onToggle}
        onMouseEnter={(e) => {
          e.target.style.transform = isOpen ? 'scale(1.15)' : 'scale(1.05)';
          e.target.style.boxShadow = '0 6px 25px rgba(76, 175, 80, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = isOpen ? 'scale(1.1)' : 'scale(1)';
          e.target.style.boxShadow = '0 4px 20px rgba(76, 175, 80, 0.4)';
        }}
        title="Assistant Visiteur"
      >
        {isOpen ? (
          <i className="fas fa-times"></i>
        ) : (
          <i className="fas fa-robot"></i>
        )}
        
        {hasUnreadMessages && (
          <div style={notificationStyle}>
            <i className="fas fa-exclamation"></i>
          </div>
        )}
      </button>
    </>
  );
};

export default ChatbotIcon; 