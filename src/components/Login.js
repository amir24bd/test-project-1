import React, { useState } from 'react';
import API_BASE from '../utils/api';
import { Link, useNavigate } from 'react-router-dom';

export default function Login(){
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [error,setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    try{
      const res = await fetch(`${API_BASE}/users/login/`, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({username: email, password})
      });
      const data = await res.json();
      if(res.ok){
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);
        if(data.user) localStorage.setItem('user', JSON.stringify(data.user));
        // navigate based on role (if available)
        const profile = data.user && data.user.profile ? data.user.profile : null;
        if(profile && profile.role === 'donor') navigate('/dashboard/donor');
        else if(profile && profile.role === 'patient') navigate('/dashboard/patient');
        else if(data.user && data.user.is_staff) navigate('/dashboard/admin');
        else navigate('/');
      } else {
        setError(JSON.stringify(data));
      }
    } catch(err){ console.error(err); setError('Login failed'); }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-5">
        <div className="card p-4 bg-primary bg-opacity-10">
          <h3>Login</h3>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-2"><label>Email</label><input value={email} onChange={e=>setEmail(e.target.value)} className="form-control" /></div>
            <div className="mb-2"><label>Password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="form-control" /></div>
            <div className="d-flex justify-content-between align-items-center mt-3">
              <button className="btn btn-primary">Login</button>
              <Link to="/register">Register Now</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
