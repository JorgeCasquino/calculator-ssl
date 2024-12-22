import React, { createContext, useContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, setState] = useState({
    sidebarOpen: true,
    currentTool: null,
    theme: 'light',
    uploadStatus: {
      loading: false,
      error: null,
      success: null
    }
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

  const setUploadStatus = (status) => {
    setState(prevState => ({
      ...prevState,
      uploadStatus: { ...prevState.uploadStatus, ...status }
    }));
  };

  const value = {
    ...state,
    toggleSidebar,
    setCurrentTool,
    setUploadStatus,
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