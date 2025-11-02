// src/pages/Login.js
import React, { useState } from 'react';
import api from '../api';
import { saveAuth } from '../utils/auth';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email:'', password:''});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function change(e) {
    const { name, value } = e.target;
    setForm(prev => ({...prev, [name]: value}));
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.email || !form.password) { alert('Provide both'); return; }
    setLoading(true);
    try {
      const res = await api.login({ email: form.email, password: form.password });
      saveAuth(res);
      navigate('/');
      window.location.reload();
    } catch (err) {
      alert(err.data?.detail || err.message);
    } finally { setLoading(false); }
  }

  return (
    <div className="container py-4">
      <div className="card mx-auto" style={{maxWidth:480}}>
        <div className="card-body">
          <h3 className="card-title mb-3">Login</h3>
          <form onSubmit={submit}>
            <div className="mb-2">
              <label className="form-label">Email</label>
              <input className="form-control" name="email" value={form.email} onChange={change} />
            </div>
            <div className="mb-2">
              <label className="form-label">Password</label>
              <input className="form-control" type="password" name="password" value={form.password} onChange={change} />
            </div>
            <div className="d-flex justify-content-between align-items-center mt-3">
              <button className="btn btn-danger" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
              <Link to="/register">Register Now</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
