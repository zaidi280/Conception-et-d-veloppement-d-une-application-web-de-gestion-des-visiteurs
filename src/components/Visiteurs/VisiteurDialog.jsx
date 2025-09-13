import React, { useState, useEffect } from 'react';
import { visiteurService } from '../../services/visiteurService';

const VisiteurDialog = ({ open, mode, visiteur, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    cin: '',
    nom: '',
    prenom: '',
    matriculeFiscale: '',
    typeVisiteur: '',
    observation: '',
    detaille: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Initialize form data when dialog opens
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && visiteur) {
        setFormData({
          cin: visiteur.cin || '',
          nom: visiteur.nom || '',
          prenom: visiteur.prenom || '',
          matriculeFiscale: visiteur.matriculeFiscale || '',
          typeVisiteur: visiteur.typeVisiteur || '',
          observation: visiteur.observation || '',
          detaille: visiteur.detaille || ''
        });
      } else {
        // Reset form for create mode
        setFormData({
          cin: '',
          nom: '',
          prenom: '',
          matriculeFiscale: '',
          typeVisiteur: '',
          observation: '',
          detaille: ''
        });
      }
      setErrors({});
    }
  }, [open, mode, visiteur]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field initially
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Real-time validation for CIN and matricule fiscale
    if (name === 'cin' && value.trim() !== '') {
      if (!/^\d{8}$/.test(value.trim())) {
        setErrors(prev => ({
          ...prev,
          cin: 'Le CIN doit contenir exactement 8 chiffres'
        }));
      }
    }

    if (name === 'matriculeFiscale' && value.trim() !== '') {
      if (!/^\d{7}[A-Za-z]$/.test(value.trim())) {
        setErrors(prev => ({
          ...prev,
          matriculeFiscale: 'Le matricule fiscale doit contenir 7 chiffres suivis d\'une lettre (ex: 1234567A)'
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validation = visiteurService.validateVisiteurData(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving visiteur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!open) return null;

  // Styles
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  };

  const dialogStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  };

  const headerStyle = {
    background: 'linear-gradient(135deg, #2c5530 0%, #1a3d1f 100%)',
    color: 'white',
    padding: '20px 25px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const titleStyle = {
    fontSize: '1.3rem',
    fontWeight: '700',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  };

  const closeButtonStyle = {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '5px',
    borderRadius: '4px',
    transition: 'background-color 0.3s ease'
  };

  const bodyStyle = {
    padding: '25px',
    overflowY: 'auto',
    flex: 1
  };

  const formGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px'
  };

  const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column'
  };

  const labelStyle = {
    color: '#1a3d1f',
    fontSize: '0.9rem',
    fontWeight: '600',
    marginBottom: '6px'
  };

  const requiredStyle = {
    color: '#dc3545'
  };

  const inputStyle = {
    padding: '12px',
    border: '2px solid #e9ecef',
    borderRadius: '6px',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
    outline: 'none'
  };

  const errorInputStyle = {
    ...inputStyle,
    borderColor: '#dc3545'
  };

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer'
  };

  const errorStyle = {
    color: '#dc3545',
    fontSize: '0.8rem',
    marginTop: '4px'
  };

  const footerStyle = {
    padding: '20px 25px',
    borderTop: '1px solid #e9ecef',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px'
  };

  const buttonStyle = {
    padding: '10px 20px',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    opacity: loading ? 0.6 : 1
  };

  const cancelButtonStyle = {
    ...buttonStyle,
    background: 'white',
    color: '#6c757d',
    border: '2px solid #e9ecef'
  };

  const saveButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #2c5530 0%, #1a3d1f 100%)',
    color: 'white',
    border: 'none'
  };

  const getTitle = () => {
    switch (mode) {
      case 'create':
        return 'Nouveau Visiteur';
      case 'edit':
        return 'Modifier Visiteur';
      case 'view':
        return 'Détails du Visiteur';
      default:
        return 'Visiteur';
    }
  };

  const getIcon = () => {
    switch (mode) {
      case 'create':
        return 'fas fa-plus';
      case 'edit':
        return 'fas fa-edit';
      case 'view':
        return 'fas fa-eye';
      default:
        return 'fas fa-user';
    }
  };

  const isReadOnly = mode === 'view';

  return (
    <div style={overlayStyle} onClick={handleClose}>
      <div style={dialogStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={headerStyle}>
          <h2 style={titleStyle}>
            <i className={getIcon()}></i>
            {getTitle()}
          </h2>
          <button
            style={closeButtonStyle}
            onClick={handleClose}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Body */}
        <div style={bodyStyle}>
          <form onSubmit={handleSubmit}>
            <div style={formGridStyle}>
              {/* CIN */}
              <div style={inputGroupStyle}>
                <label style={labelStyle}>
                  CIN <span style={requiredStyle}>*</span>
                </label>
                <input
                  type="text"
                  name="cin"
                  value={formData.cin}
                  onChange={handleInputChange}
                  style={errors.cin ? errorInputStyle : inputStyle}
                  placeholder="Entrez le CIN"
                  disabled={isReadOnly}
                  onFocus={(e) => !isReadOnly && (e.target.style.borderColor = '#2c5530')}
                  onBlur={(e) => !isReadOnly && (e.target.style.borderColor = errors.cin ? '#dc3545' : '#e9ecef')}
                />
                {errors.cin && <div style={errorStyle}>{errors.cin}</div>}
              </div>

              {/* Nom */}
              <div style={inputGroupStyle}>
                <label style={labelStyle}>
                  Nom <span style={requiredStyle}>*</span>
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  style={errors.nom ? errorInputStyle : inputStyle}
                  placeholder="Entrez le nom"
                  disabled={isReadOnly}
                  onFocus={(e) => !isReadOnly && (e.target.style.borderColor = '#2c5530')}
                  onBlur={(e) => !isReadOnly && (e.target.style.borderColor = errors.nom ? '#dc3545' : '#e9ecef')}
                />
                {errors.nom && <div style={errorStyle}>{errors.nom}</div>}
              </div>

              {/* Prénom */}
              <div style={inputGroupStyle}>
                <label style={labelStyle}>
                  Prénom <span style={requiredStyle}>*</span>
                </label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  style={errors.prenom ? errorInputStyle : inputStyle}
                  placeholder="Entrez le prénom"
                  disabled={isReadOnly}
                  onFocus={(e) => !isReadOnly && (e.target.style.borderColor = '#2c5530')}
                  onBlur={(e) => !isReadOnly && (e.target.style.borderColor = errors.prenom ? '#dc3545' : '#e9ecef')}
                />
                {errors.prenom && <div style={errorStyle}>{errors.prenom}</div>}
              </div>

              {/* Type Visiteur */}
              <div style={inputGroupStyle}>
                <label style={labelStyle}>
                  Type de Visiteur <span style={requiredStyle}>*</span>
                </label>
                <select
                  name="typeVisiteur"
                  value={formData.typeVisiteur}
                  onChange={handleInputChange}
                  style={errors.typeVisiteur ? errorInputStyle : selectStyle}
                  disabled={isReadOnly}
                  onFocus={(e) => !isReadOnly && (e.target.style.borderColor = '#2c5530')}
                  onBlur={(e) => !isReadOnly && (e.target.style.borderColor = errors.typeVisiteur ? '#dc3545' : '#e9ecef')}
                >
                  <option value="">Sélectionnez un type</option>
                  {visiteurService.getVisiteurTypes().map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.typeVisiteur && <div style={errorStyle}>{errors.typeVisiteur}</div>}
              </div>

              {/* Matricule Fiscale */}
              <div style={inputGroupStyle}>
                <label style={labelStyle}>
                  Matricule Fiscale <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <input
                  type="text"
                  name="matriculeFiscale"
                  value={formData.matriculeFiscale}
                  onChange={handleInputChange}
                  style={errors.matriculeFiscale ? errorInputStyle : inputStyle}
                  placeholder="Entrez le matricule fiscale"
                  disabled={isReadOnly}
                  required
                  onFocus={(e) => !isReadOnly && (e.target.style.borderColor = '#2c5530')}
                  onBlur={(e) => !isReadOnly && (e.target.style.borderColor = errors.matriculeFiscale ? '#dc3545' : '#e9ecef')}
                />
                {errors.matriculeFiscale && (
                  <div style={errorStyle}>{errors.matriculeFiscale}</div>
                )}
              </div>

              {/* Observation */}
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Observation</label>
                <textarea
                  name="observation"
                  value={formData.observation}
                  onChange={handleInputChange}
                  style={{
                    ...inputStyle,
                    minHeight: '80px',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                  disabled={isReadOnly}
                  placeholder="Observations générales..."
                  maxLength={500}
                  onFocus={(e) => !isReadOnly && (e.target.style.borderColor = '#2c5530')}
                  onBlur={(e) => !isReadOnly && (e.target.style.borderColor = '#e9ecef')}
                />
                <div style={{ fontSize: '0.8rem', color: '#6c757d', marginTop: '5px' }}>
                  {formData.observation.length}/500 caractères
                </div>
              </div>

              {/* Detaille - Conditional based on type */}
              {formData.typeVisiteur && (
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>
                    Détaille
                    {formData.typeVisiteur === 'VISITEUR_MALADE' && ' (Raison de la visite)'}
                    {formData.typeVisiteur === 'DOCTEUR' && ' (Destination/Service)'}
                    {formData.typeVisiteur === 'FOURNISSEUR' && ' (Livraison/Service)'}
                  </label>
                  <textarea
                    name="detaille"
                    value={formData.detaille}
                    onChange={handleInputChange}
                    style={{
                      ...inputStyle,
                      minHeight: '60px',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                    disabled={isReadOnly}
                    placeholder={
                      formData.typeVisiteur === 'VISITEUR_MALADE' ? 'Ex: Consultation, urgence, visite...' :
                      formData.typeVisiteur === 'DOCTEUR' ? 'Ex: Service cardiologie, urgences...' :
                      formData.typeVisiteur === 'FOURNISSEUR' ? 'Ex: Livraison médicaments, maintenance...' :
                      'Détails spécifiques...'
                    }
                    maxLength={300}
                    onFocus={(e) => !isReadOnly && (e.target.style.borderColor = '#2c5530')}
                    onBlur={(e) => !isReadOnly && (e.target.style.borderColor = '#e9ecef')}
                  />
                  <div style={{ fontSize: '0.8rem', color: '#6c757d', marginTop: '5px' }}>
                    {formData.detaille.length}/300 caractères
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        {!isReadOnly && (
          <div style={footerStyle}>
            <button
              type="button"
              style={cancelButtonStyle}
              onClick={handleClose}
              disabled={loading}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = '#f8f9fa';
                  e.target.style.borderColor = '#2c5530';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.borderColor = '#e9ecef';
                }
              }}
            >
              <i className="fas fa-times"></i>
              Annuler
            </button>

            <button
              type="submit"
              style={saveButtonStyle}
              onClick={handleSubmit}
              disabled={loading}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(44, 85, 48, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }
              }}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Sauvegarde...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  {mode === 'create' ? 'Créer' : 'Modifier'}
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisiteurDialog;
