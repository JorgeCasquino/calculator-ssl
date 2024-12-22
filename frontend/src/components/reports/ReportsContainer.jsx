import React from 'react';
import { useApp } from '../../hooks/useApp';
import ReportGenerator from './ReportGenerator';
import ReportList from './ReportList';

const ReportsContainer = () => {
  const { sidebarOpen } = useApp();

  return (
    <div className={`min-h-screen bg-gray-100 p-6 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
      <div className="space-y-8">
        <ReportGenerator />
        <ReportList />
      </div>
    </div>
  );
};

export default ReportsContainer;