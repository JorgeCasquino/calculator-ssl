import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
            <Route path="/dashboard" element={<PrivateRoute />}>
              <Route element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="tools" element={<ToolsContainer />} />
                <Route path="reports" element={<div>Reportes</div>} />
                <Route path="defects" element={<div>Registro de Defectos</div>} />
                <Route path="settings" element={<div>Configuración</div>} />
              </Route>
            </Route>
          </Routes>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;