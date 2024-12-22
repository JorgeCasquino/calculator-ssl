import React, { createContext, useContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, setState] = useState({
    sidebarOpen: true,
    currentTool: null,
    theme: 'light'
  });

  const toggleSidebar = () => {
    setState(prevState => ({
      ...prevState,
      sidebarOpen: !prevState.sidebarOpen
    }));
  };

  const setCurrentTool = (tool) => {
    setState(prevState => ({
      ...prevState,
      currentTool: tool
    }));
  };

  const value = {
    ...state,
    toggleSidebar,
    setCurrentTool,
    setState
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};