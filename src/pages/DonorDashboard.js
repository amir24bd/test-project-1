// src/pages/DonorDashboard.js
import React, { useEffect, useState } from 'react';
import api from '../api';

export default function DonorDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await api.donorRequests();
      setRequests(res);
    } catch (err) {
      alert(err.data?.detail || err.message);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function respond(rid, action) {
    if (!window.confirm(`Are you sure you want to ${action} this request?`)) return;
    try {
      await api.respondRequest(rid, { action });
      alert('Updated');
      load();
    } catch (err) {
      alert(err.data?.detail || err.message);
    }
  }

  return (
    <div className="container py-4">
      <h3>Donor Dashboard</h3>
      <p>Incoming Requests</p>
      {loading ? <div>Loading...</div> : (
        requests.length === 0 ? <div>No requests</div> : (
          <div className="list-group">
            {requests.map(r => (
              <div key={r.id} className="list-group-item">
                <div className="d-flex justify-content-between">
                  <div>
                    <strong>{r.requester_profile.name}</strong> ({r.requester_profile.blood_group}) <br />
                    <small className="text-muted">{new Date(r.requested_at).toLocaleString()}</small>
                    <p className="mb-1">{r.message}</p>
                    <p>Status: <strong>{r.status}</strong></p>
                  </div>
                  <div className="d-flex flex-column gap-2">
                    {r.status === 'pending' && <>
                      <button className="btn btn-sm btn-success" onClick={() => respond(r.id, 'accept')}>Accept</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => respond(r.id, 'reject')}>Reject</button>
                    </>}
                    {r.status !== 'pending' && <small className="text-muted">Responded: {r.responded_at ? new Date(r.responded_at).toLocaleString() : '-'}</small>}
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
