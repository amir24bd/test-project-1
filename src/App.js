import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import DonorDashboard from './components/DonorDashboard';
import PatientDashboard from './components/PatientDashboard';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <Router>
      <Header />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard/donor" element={<DonorDashboard />} />
          <Route path="/dashboard/patient" element={<PatientDashboard />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
