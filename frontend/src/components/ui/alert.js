import React from 'react';

export const Alert = ({ variant = 'default', className = '', children, ...props }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-900',
    destructive: 'bg-red-100 text-red-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
  };

  return (
    <div 
      role="alert"
      className={`rounded-lg p-4 text-sm ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};