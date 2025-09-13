import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { chartService } from '../../services/chartService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const EntryTimeChart = ({ dateFrom, dateTo }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chartType, setChartType] = useState('bar');

  useEffect(() => {
    loadChartData();
  }, [dateFrom, dateTo]);

  const loadChartData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await chartService.getEntryTimeAnalysis(dateFrom, dateTo);
      setChartData(data);
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error('Chart data error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Military clinic color palette with more variety
  const colors = [
    '#2c5530', '#1a3d1f', '#4a7c59', '#6b8e23', '#8fbc8f',
    '#556b2f', '#228b22', '#32cd32', '#90ee90', '#98fb98',
    '#3e6b3e', '#2d4a2d', '#5a8a5a', '#7ba05b', '#9cb59c',
    '#4f6f4f', '#3a5a3a', '#6d8d6d', '#8ea68e', '#a9c4a9'
  ];

  const prepareBarData = () => {
    if (!chartData || chartData.length === 0) return null;

    // Filter out entries with 0 count for cleaner visualization
    const filteredData = chartData.filter(item => (item.count || item.value) > 0);

    return {
      labels: filteredData.map(item => item.timeRange || item.label || item.hour || item.timeSlot),
      datasets: [
        {
          label: 'Nombre de Visiteurs',
          data: filteredData.map(item => item.count || item.value),
          backgroundColor: filteredData.map((_, index) => colors[index % colors.length]),
          borderColor: filteredData.map((_, index) => colors[(index + 1) % colors.length]),
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        }
      ]
    };
  };

  const prepareDoughnutData = () => {
    if (!chartData || chartData.length === 0) return null;

    // Filter out entries with 0 count for better doughnut visualization
    const filteredData = chartData.filter(item => (item.count || item.value) > 0);

    return {
      labels: filteredData.map(item => item.timeRange || item.label || item.hour || item.timeSlot),
      datasets: [
        {
          label: 'Répartition des Visiteurs',
          data: filteredData.map(item => item.count || item.value),
          backgroundColor: colors.slice(0, filteredData.length),
          borderColor: '#ffffff',
          borderWidth: 3,
          hoverOffset: 10
        }
      ]
    };
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: 'Arial, sans-serif',
            size: 12,
            weight: '600'
          },
          color: '#1a3d1f'
        }
      },
      title: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(26, 61, 31, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#2c5530',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true
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
            size: 11
          }
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            family: 'Arial, sans-serif',
            size: 12,
            weight: '600'
          },
          color: '#1a3d1f',
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      title: {
        display: true,
        text: 'Répartition des Heures d\'Entrée',
        font: {
          family: 'Arial, sans-serif',
          size: 16,
          weight: '700'
        },
        color: '#1a3d1f',
        padding: 20
      },
      tooltip: {
        backgroundColor: 'rgba(26, 61, 31, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#2c5530',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed * 100) / total).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      }
    },
    animation: {
      animateRotate: true,
      duration: 1000
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
    fontSize: '1.1rem'
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
        <div style={loadingStyle}>
          <i className="fas fa-spinner fa-spin" style={{ marginRight: '10px' }}></i>
          Chargement des données...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={errorStyle}>
          <div>
            <i className="fas fa-exclamation-triangle" style={{ marginBottom: '10px', fontSize: '2rem' }}></i>
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
        <div style={errorStyle}>
          <div>
            <i className="fas fa-chart-bar" style={{ marginBottom: '10px', fontSize: '2rem', color: '#6c757d' }}></i>
            <br />
            Aucune donnée disponible pour la période sélectionnée
          </div>
        </div>
      </div>
    );
  }

  // Check if all data has zero counts
  const hasVisibleData = chartData.some(item => (item.count || item.value) > 0);
  if (!hasVisibleData) {
    return (
      <div style={containerStyle}>
        <div style={errorStyle}>
          <div>
            <i className="fas fa-chart-bar" style={{ marginBottom: '10px', fontSize: '2rem', color: '#6c757d' }}></i>
            <br />
            Aucun visiteur trouvé pour la période sélectionnée
          </div>
        </div>
      </div>
    );
  }

  const data = chartType === 'bar' ? prepareBarData() : prepareDoughnutData();
  const options = chartType === 'bar' ? barOptions : doughnutOptions;

  return (
    <div style={containerStyle}>
      {/* Chart Header with Type Controls */}
      <div style={{
        background: 'linear-gradient(135deg, #2c5530 0%, #1a3d1f 100%)',
        color: 'white',
        padding: '15px 20px',
        borderRadius: '10px 10px 0 0',
        marginBottom: '0',
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
          <i className="fas fa-chart-bar"></i>
          Analyse des Heures d'Entrée
        </h3>

        {/* Chart Type Controls */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            style={{
              background: chartType === 'bar' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onClick={() => setChartType('bar')}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = chartType === 'bar' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)';
            }}
          >
            <i className="fas fa-chart-bar"></i>
            Barres
          </button>
          <button
            style={{
              background: chartType === 'doughnut' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onClick={() => setChartType('doughnut')}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = chartType === 'doughnut' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)';
            }}
          >
            <i className="fas fa-chart-pie"></i>
            Secteurs
          </button>
        </div>
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
          {chartType === 'bar' ? (
            <Bar data={data} options={options} />
          ) : (
            <Doughnut data={data} options={options} />
          )}
        </div>
      </div>
    </div>
  );
};

export default EntryTimeChart;
