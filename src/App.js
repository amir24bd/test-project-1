// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import DonorDashboard from './pages/DonorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import { getUser, isAuthenticated } from './utils/auth';

function Protected({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" />;
}

function DashboardRouter() {
  if (!isAuthenticated()) return <Navigate to="/login" />;
  const user = getUser();
  // user.is_staff indicates admin in backend
  if (user?.is_staff) return <AdminDashboard />;
  // the backend user object returned earlier may not contain profile.role.
  // We'll attempt to route based on saved info; if not available fallback to Profile check by redirecting to /profile.
  // For simplicity, let user choose to navigate; choose fallback to /profile.
  if (user?.profile && user.profile.role === 'donor') return <DonorDashboard />;
  // Try naive approach: show both dashboards links? We'll render profile and let them go to donor/patient pages via Nav
  // But support both possible roles: allow DonorDashboard and PatientDashboard route
  // We'll default to PatientDashboard if unknown.
  return <PatientDashboard />;
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profiles/:id" element={<Profile />} />
        <Route path="/profile" element={<Protected><Profile /></Protected>} />
        <Route path="/dashboard" element={<Protected><DashboardRouter/></Protected>} />
        <Route path="/donor" element={<Protected><DonorDashboard/></Protected>} />
        <Route path="/patient" element={<Protected><PatientDashboard/></Protected>} />
        <Route path="/admin" element={<Protected><AdminDashboard/></Protected>} />
      </Routes>
    </>
  );
}
