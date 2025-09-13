import React from 'react';

const SuggestionButtons = ({ suggestions, onSuggestionClick }) => {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  const containerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '8px',
  };

  const buttonStyle = {
    background: 'rgba(76, 175, 80, 0.1)',
    border: '1px solid rgba(76, 175, 80, 0.3)',
    borderRadius: '20px',
    padding: '6px 12px',
    fontSize: '12px',
    color: '#2c5530',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
    maxWidth: '200px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  return (
    <div style={containerStyle}>
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          style={buttonStyle}
          onClick={() => onSuggestionClick(suggestion)}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(76, 175, 80, 0.2)';
            e.target.style.borderColor = 'rgba(76, 175, 80, 0.5)';
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(76, 175, 80, 0.1)';
            e.target.style.borderColor = 'rgba(76, 175, 80, 0.3)';
            e.target.style.transform = 'scale(1)';
          }}
          title={suggestion}
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};

export default SuggestionButtons; 