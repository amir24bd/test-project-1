// src/pages/PatientDashboard.js
import React, { useEffect, useState } from 'react';
import api from '../api';

export default function PatientDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await api.patientRequests();
      setRequests(res);
    } catch (err) {
      alert(err.data?.detail || err.message);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="container py-4">
      <h3>My Requests</h3>
      {loading ? <div>Loading...</div> : (
        requests.length === 0 ? <div>No requests made yet</div> : (
          <div className="list-group">
            {requests.map(r => (
              <div key={r.id} className="list-group-item">
                <div className="d-flex justify-content-between">
                  <div>
                    <strong>To: {r.donor_profile.name}</strong> ({r.donor_profile.blood_group}) <br />
                    <small className="text-muted">{new Date(r.requested_at).toLocaleString()}</small>
                    <p className="mb-1">{r.message}</p>
                    <p>Status: <strong>{r.status}</strong></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
