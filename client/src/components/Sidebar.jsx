import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  AcademicCapIcon, 
  UserGroupIcon,
  BookOpenIcon,
  CalendarIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const userRole = localStorage.getItem('userRole');

  const navItems = [
    {
      name: 'Dashboard',
      icon: HomeIcon,
      path: '/',
      roles: ['Student', 'Staff', 'Admin']
    },
    {
      name: 'Faculty',
      icon: AcademicCapIcon,
      path: '/faculty',
      roles: ['Staff', 'Admin']
    },
    {
      name: 'Students',
      icon: UserGroupIcon,
      path: '/students',
      roles: ['Staff', 'Admin']
    },
    {
      name: 'Courses',
      icon: BookOpenIcon,
      path: '/courses',
      roles: ['Student', 'Staff', 'Admin']
    },
    {
      name: 'Attendance',
      icon: CalendarIcon,
      path: '/attendance',
      roles: ['Student', 'Staff', 'Admin']
    },
    {
      name: 'Hostel',
      icon: BuildingOfficeIcon,
      path: '/hostel',
      roles: ['Student', 'Staff', 'Admin']
    }
  ];

  return (
    <div className={`h-full w-64 bg-gray-900 text-white p-4 ${isOpen ? '' : 'hidden'}`}>
      <div className="text-2xl font-bold mb-8 text-center">
        EduManage Pro
      </div>
      <nav>
        {navItems.map((item, index) => (
          item.roles.includes(userRole) && (
            <Link
              key={index}
              to={item.path}
              className={`
                flex items-center gap-4 px-4 py-3 rounded-lg mb-2
                ${location.pathname === item.path 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-800'}
              `}
            >
              <item.icon className="h-6 w-6" />
              <span>{item.name}</span>
            </Link>
          )
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;