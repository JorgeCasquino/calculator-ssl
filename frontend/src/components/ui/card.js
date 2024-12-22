import React from 'react';

export const Card = ({ className = '', children, ...props }) => {
  return (
    <div 
      className={`rounded-lg border bg-white shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ className = '', children, ...props }) => {
  return (
    <div 
      className={`flex flex-col space-y-1.5 p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardTitle = ({ className = '', children, ...props }) => {
  return (
    <h3 
      className={`text-lg font-semibold leading-none tracking-tight text-gray-900 ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
};