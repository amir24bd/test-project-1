// src/pages/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import api from '../api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.adminStats();
        setStats(res);
      } catch (err) {
        alert(err.data?.detail || err.message);
      }
    }
    load();
  }, []);

  if (!stats) return <div className="container py-4">Loading...</div>;

  return (
    <div className="container py-4">
      <h3>Admin Dashboard</h3>
      <div className="row">
        <div className="col-md-3">
          <div className="card p-3">
            <h5>Total Donors</h5>
            <p className="fs-4">{stats.total_donors}</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3">
            <h5>Total Patients</h5>
            <p className="fs-4">{stats.total_patients}</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3">
            <h5>Pending Requests</h5>
            <p className="fs-4">{stats.requests_pending}</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3">
            <h5>Availability by Group</h5>
            {Object.entries(stats.availability_by_group).map(([g, v]) => (
              <div key={g} className="d-flex justify-content-between">
                <span>{g}</span><strong>{v}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
