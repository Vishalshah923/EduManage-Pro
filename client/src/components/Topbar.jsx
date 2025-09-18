import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bars3Icon, 
  BellIcon, 
  UserCircleIcon 
} from '@heroicons/react/24/outline';

const Topbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'User';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="bg-white h-16 flex items-center justify-between px-4 shadow-sm">
      {/* Left section */}
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-lg hover:bg-gray-100"
      >
        <Bars3Icon className="h-6 w-6" />
      </button>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="p-2 rounded-lg hover:bg-gray-100 relative">
          <BellIcon className="h-6 w-6" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User menu */}
        <div className="flex items-center gap-2">
          <UserCircleIcon className="h-8 w-8" />
          <div className="hidden md:block">
            <p className="text-sm font-medium">{username}</p>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;