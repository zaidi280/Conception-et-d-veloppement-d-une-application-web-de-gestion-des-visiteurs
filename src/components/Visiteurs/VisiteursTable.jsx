import React from 'react';
import '../../styles/scrollbar.css';
import { visiteurService } from '../../services/visiteurService';

const VisiteursTable = ({
  visiteurs,
  loading,
  onEdit,
  onSortie,
  onViewDetails
}) => {

  // Styles
  const containerStyle = {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  };

  const tableWrapperStyle = {
    flex: 1,
    overflow: 'auto',
    // Custom scrollbar styling for Firefox
    scrollbarWidth: 'thin',
    scrollbarColor: '#2c5530 #f1f1f1'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse'
  };

  const thStyle = {
    backgroundColor: '#f8f9fa',
    color: '#1a3d1f',
    fontWeight: '600',
    padding: '15px 12px',
    textAlign: 'left',
    borderBottom: '2px solid #e9ecef',
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'background-color 0.3s ease'
  };

  const tdStyle = {
    padding: '12px',
    borderBottom: '1px solid #e9ecef',
    verticalAlign: 'middle'
  };

  const actionButtonStyle = {
    padding: '6px 10px',
    margin: '0 2px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px'
  };

  const viewButtonStyle = {
    ...actionButtonStyle,
    backgroundColor: '#17a2b8',
    color: 'white'
  };

  const editButtonStyle = {
    ...actionButtonStyle,
    backgroundColor: '#ffc107',
    color: '#212529',
    minWidth: '32px',
    height: '32px'
  };

  const detailsButtonStyle = {
    ...actionButtonStyle,
    backgroundColor: '#007bff',
    color: 'white',
    minWidth: '32px',
    height: '32px'
  };

  const sortieButtonStyle = {
    ...actionButtonStyle,
    backgroundColor: '#dc3545',
    color: 'white',
    minWidth: '32px',
    height: '32px'
  };

  const completedButtonStyle = {
    ...actionButtonStyle,
    backgroundColor: '#28a745',
    color: 'white',
    minWidth: '32px',
    height: '32px',
    cursor: 'default',
    opacity: 0.7
  };



  const loadingStyle = {
    textAlign: 'center',
    padding: '40px',
    color: '#6c757d'
  };

  const emptyStyle = {
    textAlign: 'center',
    padding: '40px',
    color: '#6c757d'
  };

  const badgeStyle = {
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'uppercase'
  };

  const getTypeBadgeStyle = (type) => {
    const baseStyle = { ...badgeStyle };
    switch (type) {
      case 'MALADE':
        return { ...baseStyle, backgroundColor: '#f8d7da', color: '#721c24' };
      case 'DOCTEUR':
        return { ...baseStyle, backgroundColor: '#d4edda', color: '#155724' };
      case 'INFIRMIER':
        return { ...baseStyle, backgroundColor: '#d1ecf1', color: '#0c5460' };
      case 'ACCOMPAGNANT':
        return { ...baseStyle, backgroundColor: '#fff3cd', color: '#856404' };
      case 'PERSONNEL':
        return { ...baseStyle, backgroundColor: '#e2e3e5', color: '#383d41' };
      case 'FOURNISSEUR':
        return { ...baseStyle, backgroundColor: '#ffeaa7', color: '#6c5ce7' };
      default:
        return { ...baseStyle, backgroundColor: '#e2e3e5', color: '#383d41' };
    }
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={loadingStyle}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '10px' }}></i>
          <p>Chargement des visiteurs...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={tableWrapperStyle} className="table-scrollbar">
        <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>CIN</th>
            <th style={thStyle}>Nom</th>
            <th style={thStyle}>Prénom</th>
            <th style={thStyle}>Type</th>

            <th style={thStyle}>Matricule Fiscale</th>
            <th style={thStyle}>Date d'Entrée</th>
            <th style={thStyle}>Date de Sortie</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {visiteurs.length === 0 ? (
            <tr>
              <td colSpan="8" style={emptyStyle}>
                <i className="fas fa-users" style={{ fontSize: '3rem', marginBottom: '10px', color: '#dee2e6' }}></i>
                <p>Aucun visiteur trouvé</p>
              </td>
            </tr>
          ) : (
            visiteurs.map((visiteur) => (
              <tr key={visiteur.id}>
                <td style={tdStyle}>{visiteur.cin}</td>
                <td style={tdStyle}>{visiteur.nom}</td>
                <td style={tdStyle}>{visiteur.prenom}</td>
                <td style={tdStyle}>
                  <span style={getTypeBadgeStyle(visiteur.typeVisiteur)}>
                    {visiteurService.getTypeVisiteurLabel(visiteur.typeVisiteur)}
                  </span>
                </td>
                <td style={tdStyle}>{visiteur.matriculeFiscale || '-'}</td>

                <td style={tdStyle}>
                  {visiteur.dateEntree ? new Date(visiteur.dateEntree).toLocaleDateString('fr-FR') + ' ' + new Date(visiteur.dateEntree).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '-'}
                </td>
                <td style={tdStyle}>
                  {visiteur.dateSortie ? new Date(visiteur.dateSortie).toLocaleDateString('fr-FR') + ' ' + new Date(visiteur.dateSortie).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '-'}
                </td>
                <td style={tdStyle}>
                  <button
                    style={detailsButtonStyle}
                    onClick={() => onViewDetails(visiteur)}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
                    title="Voir Détails"
                  >
                    <i className="fas fa-info-circle" style={{ fontSize: '14px' }}></i>
                  </button>

                  <button
                    style={editButtonStyle}
                    onClick={() => onEdit(visiteur)}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#e0a800'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#ffc107'}
                    title="Modifier"
                  >
                    <i className="fas fa-edit" style={{ fontSize: '14px' }}></i>
                  </button>

                  {/* Show Sortie button only if dateSortie is null */}
                  {!visiteur.dateSortie ? (
                    <button
                      style={sortieButtonStyle}
                      onClick={() => onSortie(visiteur.id)}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#c82333'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}
                      title="Marquer Sortie"
                    >
                      <i className="fas fa-sign-out-alt" style={{ fontSize: '14px' }}></i>
                    </button>
                  ) : (
                    <button
                      style={completedButtonStyle}
                      title="Sortie effectuée"
                      disabled
                    >
                      <i className="fas fa-check" style={{ fontSize: '14px' }}></i>
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
        </table>
      </div>

      {/* Total Count */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '15px 20px',
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid #e9ecef',
        flexShrink: 0
      }}>
        <div style={{
          color: '#6c757d',
          fontSize: '0.9rem',
          fontWeight: '500'
        }}>
          Total: {visiteurs.length} visiteur{visiteurs.length > 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
};

export default VisiteursTable;
