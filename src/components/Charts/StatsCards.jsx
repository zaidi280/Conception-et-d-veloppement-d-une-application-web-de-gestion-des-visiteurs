import React, { useState, useEffect } from 'react';
import { visiteurService } from '../../services/visiteurService';
import { chartService } from '../../services/chartService';

const StatsCards = () => {
  const [stats, setStats] = useState({
    totalVisiteurs: 0,
    visiteursActuels: 0,
    visiteursSortis: 0,
    peakHour: 'Aucune',
    loading: true
  });

  useEffect(() => {
    loadStats();
  }, []); // Remove dependency on dateFrom/dateTo to always show today's data

  const loadStats = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true }));

      // Get today's data only (system date)
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      const params = {
        filterType: 'tous',
        dateFrom: today,
        dateTo: today
      };

      const visiteurs = await visiteurService.getAllVisiteurs(params);
      
      const totalVisiteurs = visiteurs.length;
      const visiteursActuels = visiteurs.filter(v => !v.dateSortie).length;
      const visiteursSortis = visiteurs.filter(v => v.dateSortie).length;
      
      setStats({
        totalVisiteurs,
        visiteursActuels,
        visiteursSortis,
        loading: false
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      setStats(prev => ({ ...prev, loading: false }));
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
    marginBottom: '15px',
    display: 'block'
  };

  const numberStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    marginBottom: '8px',
    display: 'block'
  };

  const labelStyle = {
    fontSize: '1rem',
    color: '#6c757d',
    fontWeight: '600',
    margin: 0
  };

  const loadingStyle = {
    color: '#6c757d',
    fontSize: '1rem'
  };

  if (stats.loading) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={cardStyle}>
            <div style={loadingStyle}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '15px' }}></i>
              <br />
              Chargement...
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Total Visiteurs */}
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
        <i className="fas fa-users" style={{ ...iconStyle, color: '#2c5530' }}></i>
        <span style={{ ...numberStyle, color: '#2c5530' }}>{stats.totalVisiteurs}</span>
        <p style={labelStyle}>Total Aujourd'hui</p>
      </div>

      {/* Visiteurs Actuels */}
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
        <i className="fas fa-user-check" style={{ ...iconStyle, color: '#28a745' }}></i>
        <span style={{ ...numberStyle, color: '#28a745' }}>{stats.visiteursActuels}</span>
        <p style={labelStyle}>Présents Maintenant</p>
      </div>

      {/* Visiteurs Sortis */}
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
        <i className="fas fa-user-times" style={{ ...iconStyle, color: '#dc3545' }}></i>
        <span style={{ ...numberStyle, color: '#dc3545' }}>{stats.visiteursSortis}</span>
        <p style={labelStyle}>Sortis Aujourd'hui</p>
      </div>
    </>
  );
};

export default StatsCards;
