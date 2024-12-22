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
                <Route path="dashboard" element={<Dashboard />} /> {/* Add this line */}
                <Route path="tools" element={<ToolsContainer />} />
                <Route path="reports" element={<div>Reportes</div>} />
                <Route path="defects" element={<div>Registro de Defectos</div>} />
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