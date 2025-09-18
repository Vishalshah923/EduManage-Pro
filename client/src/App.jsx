import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import StudentDashboard from './pages/StudentDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import HostelManagement from './pages/HostelManagement';
import Login from './pages/Login';

const App = () => {
  // Sample auth state (replace with actual auth context)
  const userRole = localStorage.getItem('userRole');

  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!userRole) return <Navigate to="/login" />;
    if (!allowedRoles.includes(userRole)) return <Navigate to="/" />;
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<Layout />}>
          {/* Student Routes */}
          <Route
            index
            element={
              <ProtectedRoute allowedRoles={['Student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          {/* Faculty Routes */}
          <Route
            path="faculty"
            element={
              <ProtectedRoute allowedRoles={['Staff']}>
                <FacultyDashboard />
              </ProtectedRoute>
            }
          />

          {/* Hostel Management */}
          <Route
            path="hostel"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Staff', 'Student']}>
                <HostelManagement />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;