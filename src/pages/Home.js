import React, { useEffect, useState } from 'react';
import api from '../api';
import DonorCard from '../components/DonorCard';

export default function Home() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    blood: '',
    city: '',
    available: false,
  });

  // Load donors from backend
  async function load() {
    try {
      setLoading(true);
      const params = {};
      if (filters.blood) params.blood = filters.blood;
      if (filters.city) params.city = filters.city;
      if (filters.available) params.available = 'true';
      const data = await api.listDonors(params);
      setDonors(data);
    } catch (err) {
      console.error('Error loading donors:', err);
      alert('Failed to load donors');
    } finally {
      setLoading(false);
    }
  }

  // Run once or when filters change
  useEffect(() => {
    load();
  }, [filters]); // ✅ includes dependency properly, no eslint warning

  function handleFilterChange(e) {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  // Handle "Send Request" click from DonorCard
  function handleRequest(donor) {
    alert(`Request sent to ${donor.name}`);
    // You can integrate api.sendRequest(donor.id) if you’ve implemented it
  }

  return (
    <div className="container py-4">
      <div className="text-center mb-4">
        <h2 className="fw-bold text-danger">Blood Management System</h2>
        <p className="text-muted">Find available blood donors in your area</p>
      </div>

      {/* Filter Section */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <form className="row g-2 align-items-end" onSubmit={e => e.preventDefault()}>
            <div className="col-md-4">
              <label className="form-label">Blood Group</label>
              <select
                name="blood"
                value={filters.blood}
                onChange={handleFilterChange}
                className="form-select"
              >
                <option value="">All</option>
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">City</label>
              <input
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                className="form-control"
                placeholder="Enter city"
              />
            </div>
            <div className="col-md-3 form-check mt-4 ms-2">
              <input
                type="checkbox"
                className="form-check-input"
                id="availableCheck"
                name="available"
                checked={filters.available}
                onChange={handleFilterChange}
              />
              <label htmlFor="availableCheck" className="form-check-label">
                Available Now
              </label>
            </div>
            <div className="col-md-1 mt-4">
              <button
                className="btn btn-danger w-100"
                type="button"
                onClick={load}
              >
                <i className="bi bi-search"></i> Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Donor List */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status"></div>
          <p className="mt-2">Loading donors...</p>
        </div>
      ) : donors.length === 0 ? (
        <div className="alert alert-warning text-center">
          No donors found for selected filters.
        </div>
      ) : (
        <div>
          <h4 className="mb-3">Available Donors ({donors.length})</h4>
          {donors.map(profile => (
            <DonorCard
              key={profile.id}
              profile={profile}
              onRequestClick={handleRequest}
            />
          ))}
        </div>
      )}
    </div>
  );
}
