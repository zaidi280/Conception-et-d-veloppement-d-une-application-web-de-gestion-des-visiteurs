import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { chartService } from '../../services/chartService';

ChartJS.register(
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const VisitorTypeChart = ({ dateFrom, dateTo }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadChartData();
  }, [dateFrom, dateTo]);

  const loadChartData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await chartService.getVisitorTypeAnalysis(dateFrom, dateTo);
      setChartData(data);
    } catch (error) {
      console.error('Chart data error:', error);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // Military clinic color palette for visitor types
  const colors = [
    '#2c5530', // Dark green for Docteurs
    '#4a7c59', // Medium green for Fournisseurs  
    '#6b8e23', // Olive green for Visiteurs Malades
    '#8fbc8f', // Light green
    '#556b2f', // Dark olive
    '#228b22'  // Forest green
  ];

  const preparePieData = () => {
    if (!chartData || chartData.length === 0) return null;

    // Filter out entries with 0 count for cleaner visualization
    const filteredData = chartData.filter(item => (item.count || 0) > 0);

    return {
      labels: filteredData.map(item => item.label || item.type),
      datasets: [
        {
          label: 'Répartition par Type',
          data: filteredData.map(item => item.count || 0),
          backgroundColor: colors.slice(0, filteredData.length),
          borderColor: '#ffffff',
          borderWidth: 3,
          hoverOffset: 10,
          hoverBorderWidth: 4
        }
      ]
    };
  };

  const data = preparePieData();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: false
      },
      legend: {
        position: 'bottom',
        labels: {
          color: '#6c757d',
          font: {
            size: 12,
            weight: '600'
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(44, 85, 48, 0.9)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: '#2c5530',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: function(context) {
            return context[0].label;
          },
          label: function(context) {
            const dataPoint = chartData.find(item => 
              (item.label || item.type) === context.label
            );
            const percentage = dataPoint?.percentage || 0;
            
            return [
              `Visiteurs: ${context.parsed}`,
              `Pourcentage: ${percentage.toFixed(1)}%`
            ];
          }
        }
      }
    }
  };

  const containerStyle = {
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(44, 85, 48, 0.1)',
    height: '450px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #2c5530 0%, #1a3d1f 100%)',
          color: 'white',
          padding: '15px 20px',
          borderRadius: '15px 15px 0 0'
        }}>
          <h3 style={{
            fontSize: '1.3rem',
            fontWeight: '700',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <i className="fas fa-users"></i>
            Analyse par Type de Visiteur
          </h3>
        </div>
        
        {/* Loading Content */}
        <div style={{ 
          backgroundColor: 'white',
          borderRadius: '0 0 15px 15px',
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{ textAlign: 'center' }}>
            <i className="fas fa-spinner fa-spin" style={{ marginBottom: '10px', fontSize: '2rem', color: '#2c5530' }}></i>
            <br />
            Chargement des données...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #2c5530 0%, #1a3d1f 100%)',
          color: 'white',
          padding: '15px 20px',
          borderRadius: '15px 15px 0 0'
        }}>
          <h3 style={{
            fontSize: '1.3rem',
            fontWeight: '700',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <i className="fas fa-users"></i>
            Analyse par Type de Visiteur
          </h3>
        </div>
        
        {/* Error Content */}
        <div style={{ 
          backgroundColor: 'white',
          borderRadius: '0 0 15px 15px',
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{ textAlign: 'center' }}>
            <i className="fas fa-exclamation-triangle" style={{ marginBottom: '10px', fontSize: '2rem', color: '#dc3545' }}></i>
            <br />
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div style={containerStyle}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #2c5530 0%, #1a3d1f 100%)',
          color: 'white',
          padding: '15px 20px',
          borderRadius: '15px 15px 0 0'
        }}>
          <h3 style={{
            fontSize: '1.3rem',
            fontWeight: '700',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <i className="fas fa-users"></i>
            Analyse par Type de Visiteur
          </h3>
        </div>
        
        {/* No Data Content */}
        <div style={{ 
          backgroundColor: 'white',
          borderRadius: '0 0 15px 15px',
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{ textAlign: 'center' }}>
            <i className="fas fa-users" style={{ marginBottom: '10px', fontSize: '2rem', color: '#6c757d' }}></i>
            <br />
            Aucune donnée disponible pour la période sélectionnée
          </div>
        </div>
      </div>
    );
  }

  // Check if all data has zero counts
  const hasVisibleData = chartData.some(item => (item.count || 0) > 0);
  if (!hasVisibleData) {
    return (
      <div style={containerStyle}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #2c5530 0%, #1a3d1f 100%)',
          color: 'white',
          padding: '15px 20px',
          borderRadius: '15px 15px 0 0'
        }}>
          <h3 style={{
            fontSize: '1.3rem',
            fontWeight: '700',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <i className="fas fa-users"></i>
            Analyse par Type de Visiteur
          </h3>
        </div>
        
        {/* No Visits Content */}
        <div style={{ 
          backgroundColor: 'white',
          borderRadius: '0 0 15px 15px',
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{ textAlign: 'center' }}>
            <i className="fas fa-users" style={{ marginBottom: '10px', fontSize: '2rem', color: '#6c757d' }}></i>
            <br />
            Aucun visiteur trouvé pour la période sélectionnée
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Chart Header */}
      <div style={{
        background: 'linear-gradient(135deg, #2c5530 0%, #1a3d1f 100%)',
        color: 'white',
        padding: '15px 20px',
        borderRadius: '15px 15px 0 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{
          fontSize: '1.3rem',
          fontWeight: '700',
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <i className="fas fa-users"></i>
          Analyse par Type de Visiteur
        </h3>
      </div>

      {/* Chart Content */}
      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '0 0 15px 15px',
        padding: '25px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0
      }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Pie data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default VisitorTypeChart;
