import React, { useEffect, useState } from "react";
import API_BASE, { authHeaders } from "../utils/api";

export default function DashboardDonor() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadRequests() {
      try {
        const res = await fetch(`${API_BASE}/requests/donor/`, {
          headers: authHeaders(),
          signal: controller.signal,
        });
        const data = await res.json();
        if (res.ok) setRequests(data);
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
      }
    }

    loadRequests();

    // ✅ must return a function that calls controller.abort()
    return () => controller.abort();
  }, []);

  return (
    <div className="container mt-4">
      <h3>Blood Requests Received</h3>
      {requests.length === 0 && <p>No requests yet.</p>}
      {requests.map((r) => (
        <div className="card mb-2 p-2" key={r.id}>
          <strong>From:</strong> {r.requester_profile?.name} <br />
          <strong>Message:</strong> {r.message}
        </div>
      ))}
    </div>
  );
}
