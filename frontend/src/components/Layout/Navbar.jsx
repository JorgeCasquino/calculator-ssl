import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../context/AppContext';
import { Menu, Bell, Settings, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { toggleSidebar } = useApp();

  return (
    <nav className="bg-white shadow-md">
      <div className="px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-1 text-gray-500 hover:text-gray-900"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-1 text-gray-500 hover:text-gray-900">
              <Bell className="h-6 w-6" />
            </button>
            
            <button className="p-1 text-gray-500 hover:text-gray-900">
              <Settings className="h-6 w-6" />
            </button>

            <div className="relative ml-3">
              <div className="flex items-center">
                <span className="mr-4 text-sm font-medium text-gray-700">
                  {user?.email}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar