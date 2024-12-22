import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  BarChart2,
  FileSpreadsheet,
  FileText,
  Upload,
  Settings
} from 'lucide-react';

const Sidebar = () => {
  const { sidebarOpen } = useApp();
  const location = useLocation();

  const menuItems = [
    {
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-6 w-6" />,
      path: '/'
    },
    {
      label: 'Herramientas',
      icon: <BarChart2 className="h-6 w-6" />,
      path: '/tools'
    },
    {
      label: 'Defectos',
      icon: <FileSpreadsheet className="h-6 w-6" />,
      path: '/defects'
    },
    {
      label: 'Reportes',
      icon: <FileText className="h-6 w-6" />,
      path: '/reports'
    },
    {
      label: 'Cargar Datos',
      icon: <Upload className="h-6 w-6" />,
      path: '/upload'
    },
    {
      label: 'Configuración',
      icon: <Settings className="h-6 w-6" />,
      path: '/settings'
    }
  ];

  return (
    <aside
      className={`${
        sidebarOpen ? 'w-64' : 'w-20'
      } fixed inset-y-0 left-0 z-30 flex flex-col bg-gray-800 transition-all duration-300`}
    >
      <div className="flex h-16 items-center justify-center bg-gray-900">
        <span className="text-xl font-bold text-white">
          {sidebarOpen ? 'Six Sigma App' : 'SS'}
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center rounded-lg px-4 py-2 text-sm font-medium ${
                isActive
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {item.icon}
              {sidebarOpen && <span className="ml-3">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export { Layout, Navbar, Sidebar };