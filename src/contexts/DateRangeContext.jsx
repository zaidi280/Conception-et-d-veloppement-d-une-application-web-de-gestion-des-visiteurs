import React, { createContext, useContext, useState } from 'react';

const DateRangeContext = createContext();

export const useDateRange = () => {
  const context = useContext(DateRangeContext);
  if (!context) {
    throw new Error('useDateRange must be used within a DateRangeProvider');
  }
  return context;
};

export const DateRangeProvider = ({ children }) => {
  // Default to last 7 days
  const getDefaultDates = () => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    return {
      from: sevenDaysAgo.toISOString().split('T')[0], // YYYY-MM-DD format
      to: today.toISOString().split('T')[0]
    };
  };

  const defaultDates = getDefaultDates();
  const [dateFrom, setDateFrom] = useState(defaultDates.from);
  const [dateTo, setDateTo] = useState(defaultDates.to);

  const updateDateRange = (from, to) => {
    setDateFrom(from);
    setDateTo(to);
  };

  const value = {
    dateFrom,
    dateTo,
    updateDateRange
  };

  return (
    <DateRangeContext.Provider value={value}>
      {children}
    </DateRangeContext.Provider>
  );
}; 