import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

const KPICard = ({ title, value, icon, change }) => {
  const isPositive = change >= 0;

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className="rounded-full bg-gray-100 p-3">{icon}</div>
      </div>
      <div className="mt-4 flex items-center">
        {isPositive ? (
          <ArrowUp className="h-4 w-4 text-green-500" />
        ) : (
          <ArrowDown className="h-4 w-4 text-red-500" />
        )}
        <span
          className={`ml-2 text-sm font-medium ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {Math.abs(change)}%
        </span>
        <span className="ml-2 text-sm text-gray-500">vs mes anterior</span>
      </div>
    </div>
  );
};