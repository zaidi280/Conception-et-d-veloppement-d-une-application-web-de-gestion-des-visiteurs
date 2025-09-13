import React, { useState, useEffect } from 'react';
import { useDateRange } from '../../contexts/DateRangeContext';

const ChartControls = ({ onDateChange }) => {
  const { dateFrom: contextDateFrom, dateTo: contextDateTo, updateDateRange } = useDateRange();
  const [dateFrom, setDateFrom] = useState(contextDateFrom);
  const [dateTo, setDateTo] = useState(contextDateTo);

  // Sync with context when context changes
  useEffect(() => {
    setDateFrom(contextDateFrom);
    setDateTo(contextDateTo);
  }, [contextDateFrom, contextDateTo]);

  const handleDateFromChange = (e) => {
    const newDateFrom = e.target.value;
    setDateFrom(newDateFrom);
    updateDateRange(newDateFrom, dateTo);
    if (onDateChange) {
      onDateChange(newDateFrom, dateTo);
    }
  };

  const handleDateToChange = (e) => {
    const newDateTo = e.target.value;
    setDateTo(newDateTo);
    updateDateRange(dateFrom, newDateTo);
    if (onDateChange) {
      onDateChange(dateFrom, newDateTo);
    }
  };

  const handleReset = () => {
    setDateFrom('');
    setDateTo('');
    updateDateRange('', '');
    if (onDateChange) {
      onDateChange('', '');
    }
  };

  const handleQuickSelect = (days) => {
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - days);
    
    const fromDate = pastDate.toISOString().split('T')[0];
    const toDate = today.toISOString().split('T')[0];
    
    setDateFrom(fromDate);
    setDateTo(toDate);
    updateDateRange(fromDate, toDate);
    if (onDateChange) {
      onDateChange(fromDate, toDate);
    }
  };

  const containerStyle = {
    backgroundColor: 'white',
    borderRadius: '15px',
    padding: '20px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(44, 85, 48, 0.1)',
    marginBottom: '20px'
  };

  const titleStyle = {
    color: '#1a3d1f',
    fontSize: '1.2rem',
    fontWeight: '700',
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const controlsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    alignItems: 'end'
  };

  const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column'
  };

  const labelStyle = {
    fontSize: '0.9rem',
    color: '#6c757d',
    marginBottom: '5px',
    fontWeight: '600'
  };

  const inputStyle = {
    padding: '10px 12px',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    fontSize: '0.9rem',
    transition: 'border-color 0.3s ease',
    fontFamily: 'inherit'
  };

  const buttonStyle = {
    background: 'linear-gradient(135deg, #2c5530 0%, #1a3d1f 100%)',
    color: 'white',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    background: '#6c757d',
    padding: '8px 12px',
    fontSize: '0.8rem'
  };



  const quickButtonsStyle = {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  };

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>
        <i className="fas fa-sliders-h"></i>
        Contrôles des Graphiques
      </h3>
      
      <div style={controlsGridStyle}>
        {/* Date From */}
        <div style={inputGroupStyle}>
          <label style={labelStyle}>Date d'Entrée (Début)</label>
          <input
            type="date"
            value={dateFrom}
            onChange={handleDateFromChange}
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#2c5530'}
            onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
          />
        </div>

        {/* Date To */}
        <div style={inputGroupStyle}>
          <label style={labelStyle}>Date d'Entrée (Fin)</label>
          <input
            type="date"
            value={dateTo}
            onChange={handleDateToChange}
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#2c5530'}
            onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
          />
        </div>



        {/* Action Buttons */}
        <div style={inputGroupStyle}>
          <label style={labelStyle}>Actions</label>
          <button
            style={secondaryButtonStyle}
            onClick={handleReset}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#5a6268'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#6c757d'}
          >
            <i className="fas fa-undo"></i>
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Quick Date Selection */}
      <div style={{ marginTop: '15px' }}>
        <label style={labelStyle}>Sélection Rapide</label>
        <div style={quickButtonsStyle}>
          <button
            style={secondaryButtonStyle}
            onClick={() => handleQuickSelect(7)}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#5a6268'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#6c757d'}
          >
            7 jours
          </button>
          <button
            style={secondaryButtonStyle}
            onClick={() => handleQuickSelect(30)}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#5a6268'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#6c757d'}
          >
            30 jours
          </button>
          <button
            style={secondaryButtonStyle}
            onClick={() => handleQuickSelect(90)}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#5a6268'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#6c757d'}
          >
            3 mois
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChartControls;
