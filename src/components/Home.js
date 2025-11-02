// src/components/Home.js
import React, { useEffect, useState } from "react";
import API_BASE from "../utils/api";
import DonorCard from "./DonorCard"; // make sure this path is correct (same folder or adjust)
import { authHeaders } from "../utils/api";

export default function Home() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadDonors() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/donors/`, {
          headers: authHeaders(),
          signal: controller.signal,
        });
        const data = await res.json();
        if (res.ok) {
          setDonors(data);
        } else {
          setError("Failed to load donors.");
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error loading donors:", err);
          setError("Error fetching donors");
        }
      } finally {
        setLoading(false);
      }
    }

    loadDonors();

    // ✅ Proper cleanup
    return () => controller.abort();
  }, []);

  const handleRequest = async (profile) => {
    try {
      const token = localStorage.getItem("access");
      if (!token) {
        alert("Please login first to send a request.");
        return;
      }
      const res = await fetch(`${API_BASE}/requests/send/${profile.id}/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: "Need blood urgently." }),
      });
      if (res.ok) {
        alert("Request sent successfully!");
      } else {
        const data = await res.json();
        alert(data.detail || "Failed to send request");
      }
    } catch (err) {
      console.error(err);
      alert("Error sending request");
    }
  };

  if (loading)
    return (
      <div className="container mt-4">
        <div className="text-center">Loading donors...</div>
      </div>
    );

  if (error)
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    );

  return (
    <div className="container mt-4">
      <h2 className="mb-3 text-center">Available Blood Donors</h2>
      {donors.length === 0 ? (
        <p className="text-center">No donors found.</p>
      ) : (
        donors.map((profile) => (
          <DonorCard
            key={profile.id}
            profile={profile}
            onRequest={handleRequest}
          />
        ))
      )}
    </div>
  );
}
