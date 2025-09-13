import React, { useState, useEffect } from 'react';
import { chartService } from '../../services/chartService';

const TodayPeakHourCard = () => {
  const [peakHourData, setPeakHourData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTodayPeakHour();
  }, []);

  const loadTodayPeakHour = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get today's date only (system date)
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      const data = await chartService.getDailyPeakHours(today, today);
      
      // Get today's data (should be first and only item)
      const todayData = data && data.length > 0 ? data[0] : null;
      console.log('Today peak hour data received:', todayData);
      setPeakHourData(todayData);
    } catch (error) {
      console.error('Today peak hour data error:', error);
      setError('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '15px',
    padding: '25px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(44, 85, 48, 0.1)',
    textAlign: 'center',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
  };

  const iconStyle = {
    fontSize: '2.5rem',
    marginBottom: '18px',
    display: 'block'
  };

  const numberStyle = {
    fontSize: '1.4rem',
    fontWeight: '700',
    marginBottom: '32px',
    display: 'block'
  };

  const labelStyle = {
    fontSize: '1rem',
    color: '#6c757d',
    fontWeight: '600',
    margin: 0,
    marginTop: '0px'
  };

  const loadingStyle = {
    color: '#6c757d',
    fontSize: '1rem'
  };

  if (loading) {
    return (
      <div 
        style={cardStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
        }}
      >
        <div style={loadingStyle}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '15px' }}></i>
          <br />
          Chargement...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        style={cardStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
        }}
      >
        <i className="fas fa-exclamation-triangle" style={{ ...iconStyle, color: '#dc3545' }}></i>
        <span style={{ ...numberStyle, color: '#dc3545' }}>Erreur</span>
        <p style={labelStyle}>Heure de Pointe</p>
      </div>
    );
  }

  if (!peakHourData || (peakHourData.totalDayEntries || 0) === 0) {
    return (
      <div 
        style={cardStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
        }}
      >
        <i className="fas fa-clock" style={{ ...iconStyle, color: '#6c757d' }}></i>
        <span style={{ ...numberStyle, color: '#6c757d' }}>Aucune</span>
        <p style={labelStyle}>Heure de Pointe</p>
      </div>
    );
  }

  return (
    <div
      style={cardStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
      }}
    >
      <i className="fas fa-clock" style={{ ...iconStyle, color: '#ff6b35' }}></i>
      <span style={{ ...numberStyle, color: '#ff6b35' }}>{peakHourData.peakHour || peakHourData.peakHourRange}</span>
      <p style={labelStyle}>Heure de Pointe</p>
    </div>
  );
};

export default TodayPeakHourCard;
