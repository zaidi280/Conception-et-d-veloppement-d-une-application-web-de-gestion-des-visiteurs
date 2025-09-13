import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console or error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
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
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(15px)',
        border: 'none',
        borderRadius: '20px',
        boxShadow: '0 25px 50px rgba(44, 85, 48, 0.3)',
        maxWidth: '500px',
        width: '100%',
        padding: '40px 35px',
        textAlign: 'center'
      };

      const buttonStyle = {
        background: 'linear-gradient(135deg, #2c5530 0%, #1a3d1f 100%)',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        margin: '0 auto'
      };

      return (
        <div style={containerStyle}>
          <div style={cardStyle}>
            <div style={{ marginBottom: '30px' }}>
              <i className="fas fa-exclamation-triangle" style={{ fontSize: '4rem', color: '#ffc107', marginBottom: '20px' }}></i>
            </div>
            <h2 style={{ color: '#1a3d1f', fontSize: '1.8rem', fontWeight: '700', marginBottom: '15px' }}>
              Erreur Système
            </h2>
            <p style={{ color: '#6c757d', fontSize: '1rem', marginBottom: '30px' }}>
              Une erreur inattendue s'est produite. Veuillez actualiser la page ou contacter l'administrateur.
            </p>

            {import.meta.env.DEV && (
              <details style={{ textAlign: 'left', marginBottom: '30px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <summary style={{ color: '#6c757d', fontSize: '0.9rem', cursor: 'pointer', marginBottom: '10px' }}>
                  Détails de l'erreur (Développement)
                </summary>
                <pre style={{ fontSize: '0.8rem', color: '#dc3545', margin: 0, whiteSpace: 'pre-wrap' }}>
                  {this.state.error && this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack && (
                    <>
                      <br />
                      {this.state.errorInfo.componentStack}
                    </>
                  )}
                </pre>
              </details>
            )}

            <button
              style={buttonStyle}
              onClick={this.handleReload}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(44, 85, 48, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <i className="fas fa-refresh"></i>
              Actualiser la Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
