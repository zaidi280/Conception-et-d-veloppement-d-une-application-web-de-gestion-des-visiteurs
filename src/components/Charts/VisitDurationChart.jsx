import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { chartService } from '../../services/chartService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const VisitDurationChart = ({ dateFrom, dateTo }) => {
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
      const data = await chartService.getVisitDurationAnalysis(dateFrom, dateTo);
      setChartData(data);
    } catch (error) {
      console.error('Chart data error:', error);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // Military clinic color palette
  const colors = [
    '#2c5530', '#1a3d1f', '#4a7c59', '#6b8e23', '#8fbc8f',
    '#556b2f', '#228b22', '#32cd32', '#90ee90', '#98fb98'
  ];

  const prepareBarData = () => {
    if (!chartData || chartData.length === 0) return null;

    // Filter out entries with 0 count for cleaner visualization
    const filteredData = chartData.filter(item => (item.count || 0) > 0);

    return {
      labels: filteredData.map(item => item.durationRange || item.label),
      datasets: [
        {
          label: 'Nombre de Visites',
          data: filteredData.map(item => item.count || 0),
          backgroundColor: filteredData.map((_, index) => colors[index % colors.length]),
          borderColor: filteredData.map((_, index) => colors[(index + 1) % colors.length]),
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        }
      ]
    };
  };

  const data = prepareBarData();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      title: {
        display: false
      },
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(44, 85, 48, 0.9)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: '#2c5530',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: function(context) {
            return context[0].label;
          },
          label: function(context) {
            return `Visites: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(44, 85, 48, 0.1)',
          lineWidth: 1
        },
        ticks: {
          color: '#6c757d',
          font: {
            size: 11
          },
          stepSize: 1,
          callback: function(value) {
            if (Number.isInteger(value)) {
              return value;
            }
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6c757d',
          font: {
            size: 10
          },
          maxRotation: 45,
          minRotation: 45
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

  const loadingStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    color: '#6c757d',
    fontSize: '1rem',
    textAlign: 'center'
  };

  const errorStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    color: '#dc3545',
    fontSize: '1rem',
    textAlign: 'center'
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
            <i className="fas fa-clock"></i>
            Analyse de la Durée des Visites
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
            <i className="fas fa-clock"></i>
            Analyse de la Durée des Visites
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
            <i className="fas fa-clock"></i>
            Analyse de la Durée des Visites
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
            <i className="fas fa-clock" style={{ marginBottom: '10px', fontSize: '2rem', color: '#6c757d' }}></i>
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
            <i className="fas fa-clock"></i>
            Analyse de la Durée des Visites
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
            <i className="fas fa-clock" style={{ marginBottom: '10px', fontSize: '2rem', color: '#6c757d' }}></i>
            <br />
            Aucune visite terminée trouvée pour la période sélectionnée
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
          <i className="fas fa-clock"></i>
          Analyse de la Durée des Visites
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
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default VisitDurationChart;
