import React from 'react';
import Layout from './Layout/Layout';
import { useAuth } from '../contexts/AuthContext';
import { useDateRange } from '../contexts/DateRangeContext';
import EntryTimeChart from './Charts/EntryTimeChart';
import VisitDurationChart from './Charts/VisitDurationChart';
import VisitorTypeChart from './Charts/VisitorTypeChart';
import AverageVisitDurationChart from './Charts/AverageVisitDurationChart';
import ChartControls from './Charts/ChartControls';
import StatsCards from './Charts/StatsCards';
import TodayPeakHourCard from './Charts/TodayPeakHourCard';

const Dashboard = () => {
  const { user } = useAuth();
  const { dateFrom, dateTo, updateDateRange } = useDateRange();

  const handleDateChange = (from, to) => {
    updateDateRange(from, to);
  };

  // Styles
  const containerStyle = {
    padding: '40px',
    backgroundColor: '#f5f7fa',
    minHeight: '100vh'
  };

  const sidebarStyle = {
    position: 'fixed',
    left: 0,
    top: 0,
    width: '280px',
    height: '100vh',
    background: 'linear-gradient(180deg, #2c5530 0%, #1a3d1f 100%)',
    boxShadow: '2px 0 10px rgba(44, 85, 48, 0.3)',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column'
  };

  const sidebarHeaderStyle = {
    padding: '25px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  };

  const brandStyle = {
    color: 'white',
    fontSize: '1.4rem',
    fontWeight: '700',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '15px'
  };

  const headerUserInfoStyle = {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    paddingLeft: '4px'
  };

  const sidebarNavStyle = {
    flex: 1,
    padding: '20px 0'
  };

  const navLinkStyle = {
    color: 'rgba(255, 255, 255, 0.9)',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    padding: '15px 25px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    transition: 'all 0.3s ease',
    borderLeft: '3px solid transparent'
  };

  const activeNavLinkStyle = {
    ...navLinkStyle,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderLeftColor: 'white',
    color: 'white'
  };

  const sidebarFooterStyle = {
    padding: '25px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
  };

  const logoutButtonStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    color: 'white',
    padding: '12px 20px',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    justifyContent: 'center'
  };

  return (
    <Layout>
      <div style={containerStyle}>


        {/* Charts Section */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{
            color: '#1a3d1f',
            fontSize: '2rem',
            fontWeight: '700',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <i className="fas fa-chart-line"></i>
            Analyses et Statistiques
          </h2>

          {/* Today's Statistics Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <StatsCards />
            <TodayPeakHourCard />
          </div>

          {/* Chart Controls */}
          <ChartControls
            onDateChange={handleDateChange}
          />



          {/* Charts Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
            gap: '25px',
            marginBottom: '30px'
          }}>
            {/* Entry Time Analysis Chart */}
            <EntryTimeChart
              dateFrom={dateFrom}
              dateTo={dateTo}
            />

            {/* Visit Duration Chart */}
            <VisitDurationChart
              dateFrom={dateFrom}
              dateTo={dateTo}
            />

            {/* Visitor Type Chart */}
            <VisitorTypeChart
              dateFrom={dateFrom}
              dateTo={dateTo}
            />

            {/* Average Visit Duration Chart */}
            <AverageVisitDurationChart
              dateFrom={dateFrom}
              dateTo={dateTo}
            />
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
