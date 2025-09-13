import React, { useState } from 'react';

const VisiteurFilters = ({ filters, onFilterChange, loading }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Filter ${name} changed to:`, value); // Debug log
    setLocalFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = () => {
    console.log('Searching with filters:', localFilters); // Debug log
    onFilterChange(localFilters);
  };

  const handleReset = () => {
    // Get default date range (last 7 days)
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    const resetFilters = {
      filterType: 'tous',
      dateFrom: sevenDaysAgo.toISOString().split('T')[0],
      dateTo: today.toISOString().split('T')[0]
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Styles
  const containerStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '10px',
    marginBottom: '8px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
  };

  const titleStyle = {
    color: '#1a3d1f',
    fontSize: '1rem',
    fontWeight: '600',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  };

  const filtersGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '8px',
    marginBottom: '10px'
  };

  const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '6px'
  };

  const labelStyle = {
    color: '#1a3d1f',
    fontSize: '0.9rem',
    fontWeight: '600',
    marginBottom: '5px'
  };

  const inputStyle = {
    padding: '10px 12px',
    border: '2px solid #e9ecef',
    borderRadius: '6px',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
    outline: 'none'
  };

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer'
  };

  const buttonsContainerStyle = {
    display: 'flex',
    gap: '8px',
    justifyContent: 'flex-end',
    marginTop: '8px'
  };

  const buttonStyle = {
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  };

  const searchButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #2c5530 0%, #1a3d1f 100%)',
    color: 'white',
    border: 'none'
  };

  const resetButtonStyle = {
    ...buttonStyle,
    background: 'white',
    color: '#6c757d',
    border: '2px solid #e9ecef'
  };

  return (
    <div style={containerStyle}>
      {/* Ultra Compact Layout */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

        {/* Filtre de Recherche Section */}
        <div>
          <h4 style={{
            color: '#1a3d1f',
            fontSize: '1rem',
            fontWeight: '600',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <i className="fas fa-filter"></i>
            Filtre de Recherche
          </h4>
        </div>

        {/* Période d'Entrée Section */}
        <div>
          <h4 style={{
            color: '#1a3d1f',
            fontSize: '1rem',
            fontWeight: '600',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <i className="fas fa-calendar-alt"></i>
            Période d'Entrée
          </h4>

          {/* Single line with dates and radio buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            {/* Date inputs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: '500', color: '#1a3d1f', minWidth: '25px' }}>Du</span>
              <input
                type="date"
                name="dateFrom"
                value={localFilters.dateFrom}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                style={{
                  ...inputStyle,
                  padding: '8px 12px',
                  width: '150px'
                }}
                onFocus={(e) => e.target.style.borderColor = '#2c5530'}
                onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                title="Date de début"
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: '500', color: '#1a3d1f', minWidth: '25px' }}>Au</span>
              <input
                type="date"
                name="dateTo"
                value={localFilters.dateTo}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                style={{
                  ...inputStyle,
                  padding: '8px 12px',
                  width: '150px'
                }}
                onFocus={(e) => e.target.style.borderColor = '#2c5530'}
                onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                title="Date de fin"
              />
            </div>

            {/* Radio buttons beside the date inputs */}
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: '500' }}>
                <input
                  type="radio"
                  name="filterType"
                  value="tous"
                  checked={localFilters.filterType === 'tous'}
                  onChange={handleInputChange}
                  style={{ marginRight: '4px' }}
                />
                Tous
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: '500' }}>
                <input
                  type="radio"
                  name="filterType"
                  value="entree"
                  checked={localFilters.filterType === 'entree'}
                  onChange={handleInputChange}
                  style={{ marginRight: '4px' }}
                />
                Entrées
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: '500' }}>
                <input
                  type="radio"
                  name="filterType"
                  value="sortie"
                  checked={localFilters.filterType === 'sortie'}
                  onChange={handleInputChange}
                  style={{ marginRight: '4px' }}
                />
                Sorties
              </label>
            </div>
          </div>
        </div>
      </div>

      <div style={buttonsContainerStyle}>
        <button
          style={resetButtonStyle}
          onClick={handleReset}
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
          <i className="fas fa-undo"></i>
          Réinitialiser
        </button>

        <button
          style={searchButtonStyle}
          onClick={handleSearch}
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
          <i className="fas fa-search"></i>
          {loading ? 'Recherche...' : 'Rechercher'}
        </button>
      </div>
    </div>
  );
};

export default VisiteurFilters;
