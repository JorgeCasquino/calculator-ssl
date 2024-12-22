import React from 'react';

export const Alert = ({ type, message }) => {
  const alertType = type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700';

  return (
    <div className={`p-4 mb-4 text-sm ${alertType} rounded-lg`} role="alert">
      {message}
    </div>
  );
};