import React from 'react';
import SuggestionButtons from './SuggestionButtons';

const MessageBubble = ({ message, onSuggestionClick }) => {
  const isUser = message.type === 'user';
  const isError = message.isError;

  const bubbleStyle = {
    display: 'flex',
    justifyContent: isUser ? 'flex-end' : 'flex-start',
    marginBottom: '15px',
  };

  const messageStyle = {
    maxWidth: '80%',
    padding: '12px 16px',
    borderRadius: '18px',
    fontSize: '14px',
    lineHeight: '1.4',
    wordWrap: 'break-word',
    position: 'relative',
    ...(isUser ? {
      background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
      color: 'white',
      borderBottomRightRadius: '5px',
    } : {
      background: isError ? 'rgba(255, 68, 68, 0.1)' : 'white',
      color: isError ? '#d32f2f' : '#333',
      border: isError ? '1px solid rgba(255, 68, 68, 0.3)' : '1px solid #e0e0e0',
      borderBottomLeftRadius: '5px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    }),
  };

  const timestampStyle = {
    fontSize: '11px',
    color: isUser ? 'rgba(255, 255, 255, 0.7)' : '#999',
    marginTop: '5px',
    textAlign: isUser ? 'right' : 'left',
  };

  const formatContent = (content) => {
    if (!content) return '';
    
    // Convert markdown-style formatting
    let formatted = content
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic text
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Code blocks
      .replace(/`(.*?)`/g, '<code>$1</code>')
      // Line breaks
      .replace(/\n/g, '<br />');

    return formatted;
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div style={bubbleStyle}>
      <div style={messageStyle}>
        <div 
          dangerouslySetInnerHTML={{ 
            __html: formatContent(message.content) 
          }}
          style={{
            whiteSpace: 'pre-wrap',
          }}
        />
        
        {message.timestamp && (
          <div style={timestampStyle}>
            {formatTime(message.timestamp)}
          </div>
        )}
      </div>

      {/* Suggestions for bot messages */}
      {!isUser && message.suggestions && message.suggestions.length > 0 && (
        <div style={{ marginTop: '10px' }}>
          <SuggestionButtons 
            suggestions={message.suggestions.filter(suggestion => 
              !suggestion.includes('Voir les détails') && 
              !suggestion.includes('Analyse temporelle')
            )}
            onSuggestionClick={onSuggestionClick}
          />
        </div>
      )}

      {/* Visitor data display */}
      {!isUser && message.visitors && message.visitors.length > 0 && (
        <div style={{
          marginTop: '10px',
          background: 'rgba(76, 175, 80, 0.05)',
          borderRadius: '10px',
          padding: '10px',
          border: '1px solid rgba(76, 175, 80, 0.2)'
        }}>
          <div style={{
            fontSize: '12px',
            fontWeight: '600',
            color: '#2c5530',
            marginBottom: '8px'
          }}>
            📋 Données des visiteurs:
          </div>
          {message.visitors.slice(0, 3).map((visitor, index) => (
            <div key={index} style={{
              fontSize: '12px',
              color: '#666',
              marginBottom: '5px',
              padding: '5px',
              background: 'white',
              borderRadius: '5px',
              border: '1px solid #e0e0e0'
            }}>
              <strong>{visitor.prenom} {visitor.nom}</strong> ({visitor.cin})
              <br />
              Type: {visitor.typeVisiteur?.value || 'Non spécifié'}
              {visitor.dateEntree && (
                <span style={{ color: '#999' }}>
                  {' - Entrée: ' + new Date(visitor.dateEntree).toLocaleString('fr-FR')}
                </span>
              )}
            </div>
          ))}
          {message.visitors.length > 3 && (
            <div style={{
              fontSize: '11px',
              color: '#999',
              textAlign: 'center',
              fontStyle: 'italic'
            }}>
              ... et {message.visitors.length - 3} autre(s) visiteur(s)
            </div>
          )}
        </div>
      )}

      {/* Analytics data display */}
      {!isUser && message.analytics && (
        <div style={{
          marginTop: '10px',
          background: 'rgba(33, 150, 243, 0.05)',
          borderRadius: '10px',
          padding: '10px',
          border: '1px solid rgba(33, 150, 243, 0.2)'
        }}>
          <div style={{
            fontSize: '12px',
            fontWeight: '600',
            color: '#1976d2',
            marginBottom: '8px'
          }}>
            📊 Statistiques:
          </div>
          {Object.entries(message.analytics).map(([key, value]) => (
            <div key={key} style={{
              fontSize: '12px',
              color: '#666',
              marginBottom: '3px'
            }}>
              <strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value) : value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageBubble; 