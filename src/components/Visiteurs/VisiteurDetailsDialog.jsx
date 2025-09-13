import React from 'react';
import { visiteurService } from '../../services/visiteurService';

const VisiteurDetailsDialog = ({ visiteur, isOpen, onClose }) => {
  if (!isOpen || !visiteur) return null;

  // Styles
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  };

  const dialogStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '80vh',
    overflow: 'auto',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
    position: 'relative'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
    paddingBottom: '15px',
    borderBottom: '2px solid #e9ecef'
  };

  const titleStyle = {
    color: '#1a3d1f',
    fontSize: '1.5rem',
    fontWeight: '700',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  };

  const closeButtonStyle = {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#6c757d',
    padding: '5px',
    borderRadius: '50%',
    width: '35px',
    height: '35px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const contentStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '25px'
  };

  const fieldStyle = {
    marginBottom: '15px'
  };

  const labelStyle = {
    display: 'block',
    fontWeight: '600',
    color: '#495057',
    marginBottom: '5px',
    fontSize: '0.9rem'
  };

  const valueStyle = {
    color: '#212529',
    fontSize: '1rem',
    padding: '8px 12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    border: '1px solid #e9ecef'
  };

  const fullWidthFieldStyle = {
    gridColumn: '1 / -1'
  };

  const textareaStyle = {
    ...valueStyle,
    minHeight: '80px',
    resize: 'none',
    fontFamily: 'inherit',
    lineHeight: '1.5'
  };

  const badgeStyle = {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
    display: 'inline-block'
  };

  const getTypeBadgeStyle = (type) => {
    const baseStyle = { ...badgeStyle };
    switch (type) {
      case 'VISITEUR_MALADE':
        return { ...baseStyle, backgroundColor: '#e3f2fd', color: '#1976d2' };
      case 'DOCTEUR':
        return { ...baseStyle, backgroundColor: '#e8f5e9', color: '#388e3c' };
      case 'FOURNISSEUR':
        return { ...baseStyle, backgroundColor: '#fff3e0', color: '#f57c00' };
      default:
        return { ...baseStyle, backgroundColor: '#f5f5f5', color: '#666' };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={dialogStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={headerStyle}>
          <h2 style={titleStyle}>
            <i className="fas fa-user-circle"></i>
            Détails du Visiteur
          </h2>
          <button
            style={closeButtonStyle}
            onClick={onClose}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Content */}
        <div style={contentStyle}>
          {/* CIN */}
          <div style={fieldStyle}>
            <label style={labelStyle}>CIN</label>
            <div style={valueStyle}>{visiteur.cin || '-'}</div>
          </div>

          {/* Nom */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Nom</label>
            <div style={valueStyle}>{visiteur.nom || '-'}</div>
          </div>

          {/* Prénom */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Prénom</label>
            <div style={valueStyle}>{visiteur.prenom || '-'}</div>
          </div>

          {/* Matricule Fiscale */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Matricule Fiscale</label>
            <div style={valueStyle}>{visiteur.matriculeFiscale || '-'}</div>
          </div>

          {/* Type Visiteur */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Type de Visiteur</label>
            <div style={valueStyle}>
              <span style={getTypeBadgeStyle(visiteur.typeVisiteur)}>
                {visiteurService.getTypeVisiteurLabel(visiteur.typeVisiteur)}
              </span>
            </div>
          </div>

          {/* Date d'Entrée */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Date d'Entrée</label>
            <div style={valueStyle}>{formatDate(visiteur.dateEntree)}</div>
          </div>

          {/* Date de Sortie */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Date de Sortie</label>
            <div style={valueStyle}>{formatDate(visiteur.dateSortie)}</div>
          </div>

          {/* User Entrée */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Utilisateur Entrée</label>
            <div style={valueStyle}>{visiteur.userEntree || '-'}</div>
          </div>

          {/* User Sortie */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Utilisateur Sortie</label>
            <div style={valueStyle}>{visiteur.userSortie || '-'}</div>
          </div>

          {/* Observation */}
          <div style={{...fieldStyle, ...fullWidthFieldStyle}}>
            <label style={labelStyle}>Observation</label>
            <div style={textareaStyle}>
              {visiteur.observation || 'Aucune observation'}
            </div>
          </div>

          {/* Détaille */}
          <div style={{...fieldStyle, ...fullWidthFieldStyle}}>
            <label style={labelStyle}>Détaille</label>
            <div style={textareaStyle}>
              {visiteur.detaille || 'Aucun détail'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisiteurDetailsDialog;
