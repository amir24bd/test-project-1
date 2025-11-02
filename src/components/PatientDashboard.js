import React, { useEffect, useState } from "react";
import API_BASE, { authHeaders } from "../utils/api";

export default function DashboardPatient() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMyRequests() {
      try {
        const res = await fetch(`${API_BASE}/requests/patient/`, {
          headers: authHeaders(),
          signal: controller.signal,
        });
        const data = await res.json();
        if (res.ok) setRequests(data);
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
      }
    }

    loadMyRequests();

    // ✅ correct cleanup
    return () => controller.abort();
  }, []);

  return (
    <div className="container mt-4">
      <h3>My Blood Requests</h3>
      {requests.length === 0 && <p>No requests made.</p>}
      {requests.map((r) => (
        <div className="card mb-2 p-2" key={r.id}>
          <strong>To:</strong> {r.donor_profile?.name} <br />
          <strong>Status:</strong> {r.status}
        </div>
      ))}
    </div>
  );
}
