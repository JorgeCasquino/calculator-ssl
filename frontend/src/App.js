import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import PrivateRoute from './components/auth/PrivateRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Layout from './components/Layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import { ToolsContainer } from './components/tools/sixsigma/ToolsContainer';
import FileUpload from './components/data/FileUpload';
import DefectsContainer from './components/defects/DefectsContainer';
import ReportsContainer from './components/reports/ReportsContainer';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/" element={<PrivateRoute />}>
              <Route element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="tools" element={<ToolsContainer />} />
                <Route path="reports" element={<ReportsContainer />} />
                <Route path="defects"  element={<DefectsContainer />} />
                <Route path="upload" element={<FileUpload />} />
                <Route path="settings" element={<div>Configuración</div>} />
              </Route>
            </Route>

            {/* Catch-all route to redirect to dashboard or login */}
            <Route 
              path="*" 
              element={<Navigate to="/" replace />} 
            />
          </Routes>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;