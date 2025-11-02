import React, { useEffect, useState } from 'react';
import API_BASE from '../utils/api';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard(){
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();
  useEffect(()=> {
    const user = localStorage.getItem('user');
    if(!user) navigate('/login');
    else fetchStats();
  },[]);

  async function fetchStats(){
    const token = localStorage.getItem('access');
    const res = await fetch(`${API_BASE}/admin/stats/`, {
      headers: {'Authorization': `Bearer ${token}`}
    });
    const data = await res.json();
    setStats(data);
  }

  if(!stats) return <p>Loading...</p>;
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <ul className="list-group">
        <li className="list-group-item">Total donors: {stats.total_donors}</li>
        <li className="list-group-item">Total patients: {stats.total_patients}</li>
        <li className="list-group-item">Pending requests: {stats.requests_pending}</li>
        <li className="list-group-item">
          <strong>Availability by group:</strong>
          <pre>{JSON.stringify(stats.availability_by_group, null, 2)}</pre>
        </li>
      </ul>
    </div>
  );
}
