import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { chartService } from '../../services/chartService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AverageVisitDurationChart = ({ dateFrom, dateTo }) => {
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
      const data = await chartService.getAverageVisitDurationAnalysis(dateFrom, dateTo);
      console.log('Average visit duration chart data received:', data);
      console.log('Data length:', data?.length);
      console.log('Sample data item:', data?.[0]);
      setChartData(data);
    } catch (error) {
      console.error('Chart data error:', error);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const prepareLineData = () => {
    if (!chartData || chartData.length === 0) return null;

    // Filter out entries with 0 visit count for cleaner visualization
    const filteredData = chartData.filter(item => (item.totalVisits || item.visitCount || 0) > 0);
    console.log('Filtered data for average visit duration:', filteredData);
    console.log('Filtered data length:', filteredData.length);

    return {
      labels: filteredData.map(item => item.label || item.period),
      datasets: [
        {
          label: 'Durée Moyenne (heures)',
          data: filteredData.map(item => item.averageDurationHours || 0),
          borderColor: '#2c5530',
          backgroundColor: 'rgba(44, 85, 48, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#2c5530',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 3,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: '#1a3d1f',
          pointHoverBorderColor: '#ffffff',
          pointHoverBorderWidth: 3,
        }
      ]
    };
  };

  const data = prepareLineData();

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
            const dataPoint = chartData.find(item => 
              (item.label || item.period) === context.label
            );
            const visitCount = dataPoint?.totalVisits || dataPoint?.visitCount || 0;
            const avgMinutes = dataPoint?.averageDurationMinutes || 0;
            const hours = Math.floor(avgMinutes / 60);
            const minutes = Math.floor(avgMinutes % 60);
            
            return [
              `Durée moyenne: ${hours}h ${minutes}min`,
              `Nombre de visites: ${visitCount}`
            ];
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
              return value + 'h';
            }
          }
        },
        title: {
          display: true,
          text: 'Durée Moyenne (heures)',
          color: '#6c757d',
          font: {
            size: 12,
            weight: '600'
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(44, 85, 48, 0.1)',
          lineWidth: 1
        },
        ticks: {
          color: '#6c757d',
          font: {
            size: 10
          },
          maxRotation: 45,
          minRotation: 0
        },
        title: {
          display: true,
          text: 'Période',
          color: '#6c757d',
          font: {
            size: 12,
            weight: '600'
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
            <i className="fas fa-chart-line"></i>
            Durée Moyenne des Visites
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
            <i className="fas fa-chart-line"></i>
            Durée Moyenne des Visites
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
            <i className="fas fa-chart-line"></i>
            Durée Moyenne des Visites
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
            <i className="fas fa-chart-line" style={{ marginBottom: '10px', fontSize: '2rem', color: '#6c757d' }}></i>
            <br />
            Aucune donnée disponible pour la période sélectionnée
          </div>
        </div>
      </div>
    );
  }

  // Check if all data has zero visit counts
  const hasVisibleData = chartData.some(item => (item.totalVisits || item.visitCount || 0) > 0);
  console.log('Has visible data check:', hasVisibleData);
  console.log('Chart data for visibility check:', chartData);
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
            <i className="fas fa-chart-line"></i>
            Durée Moyenne des Visites
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
            <i className="fas fa-chart-line" style={{ marginBottom: '10px', fontSize: '2rem', color: '#6c757d' }}></i>
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
          <i className="fas fa-chart-line"></i>
          Durée Moyenne des Visites
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
          <Line data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default AverageVisitDurationChart;
