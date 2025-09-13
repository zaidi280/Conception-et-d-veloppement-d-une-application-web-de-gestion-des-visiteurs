import React, { useState, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import SuggestionButtons from './SuggestionButtons';

const ChatWindow = ({ 
  messages, 
  isLoading, 
  error, 
  onSendMessage, 
  onSuggestionClick, 
  onClearChat, 
  onClose,
  messagesEndRef 
}) => {
  const [inputValue, setInputValue] = useState('');

  const windowStyle = {
    position: 'fixed',
    bottom: '100px',
    right: '30px',
    width: '400px',
    height: '500px',
    background: 'white',
    borderRadius: '15px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 999,
    border: '1px solid #e0e0e0',
    overflow: 'hidden',
  };

  const headerStyle = {
    background: 'linear-gradient(135deg, #2c5530 0%, #1a3d1f 100%)',
    color: 'white',
    padding: '15px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopLeftRadius: '15px',
    borderTopRightRadius: '15px',
  };

  const headerTitleStyle = {
    fontSize: '16px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const headerActionsStyle = {
    display: 'flex',
    gap: '10px',
  };

  const actionButtonStyle = {
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    color: 'white',
    padding: '5px 8px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '12px',
    transition: 'all 0.2s ease',
  };

  const messagesContainerStyle = {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    background: '#f8f9fa',
  };

  const inputContainerStyle = {
    padding: '15px 20px',
    borderTop: '1px solid #e0e0e0',
    background: 'white',
  };

  const inputGroupStyle = {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-end',
  };

  const inputStyle = {
    flex: 1,
    padding: '12px 15px',
    border: '2px solid #e0e0e0',
    borderRadius: '25px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.3s ease',
    resize: 'none',
    minHeight: '45px',
    maxHeight: '100px',
    fontFamily: 'inherit',
  };

  const sendButtonStyle = {
    background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '45px',
    height: '45px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)',
  };

  const handleSend = () => {
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
  };

  return (
    <div style={windowStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={headerTitleStyle}>
          <i className="fas fa-robot"></i>
          Assistant Visiteur
        </div>
        <div style={headerActionsStyle}>
          <button
            style={actionButtonStyle}
            onClick={onClearChat}
            title="Effacer la conversation"
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            <i className="fas fa-trash"></i>
          </button>
          <button
            style={actionButtonStyle}
            onClick={onClose}
            title="Fermer"
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div style={messagesContainerStyle}>
        {messages.map((message, index) => (
          <MessageBubble
            key={index}
            message={message}
            onSuggestionClick={onSuggestionClick}
          />
        ))}
        
        {isLoading && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 15px',
            background: 'rgba(76, 175, 80, 0.1)',
            borderRadius: '15px',
            marginBottom: '10px',
            fontSize: '14px',
            color: '#2c5530'
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              border: '2px solid #4CAF50',
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            L'assistant réfléchit...
          </div>
        )}

        {error && (
          <div style={{
            padding: '10px 15px',
            background: 'rgba(255, 68, 68, 0.1)',
            borderRadius: '15px',
            marginBottom: '10px',
            fontSize: '14px',
            color: '#d32f2f',
            border: '1px solid rgba(255, 68, 68, 0.3)'
          }}>
            <i className="fas fa-exclamation-triangle" style={{ marginRight: '8px' }}></i>
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Container */}
      <div style={inputContainerStyle}>
        <div style={inputGroupStyle}>
          <textarea
            style={inputStyle}
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Tapez votre message..."
            disabled={isLoading}
            rows={1}
          />
          <button
            style={{
              ...sendButtonStyle,
              opacity: inputValue.trim() && !isLoading ? 1 : 0.6,
              cursor: inputValue.trim() && !isLoading ? 'pointer' : 'not-allowed'
            }}
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            onMouseEnter={(e) => {
              if (inputValue.trim() && !isLoading) {
                e.target.style.transform = 'scale(1.1)';
                e.target.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (inputValue.trim() && !isLoading) {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 2px 8px rgba(76, 175, 80, 0.3)';
              }
            }}
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>

      {/* Loading Animation CSS */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default ChatWindow; 