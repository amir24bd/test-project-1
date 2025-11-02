import React, { useState } from 'react';
import API_BASE from '../utils/api';
import { useNavigate } from 'react-router-dom';

const BLOOD_GROUPS = ['A+','A-','B+','B-','O+','O-','AB+','AB-'];

export default function Register(){
  const [name, setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [confirm,setConfirm] = useState('');
  const [blood,setBlood] = useState('O+');
  const [city,setCity] = useState('');
  const [role,setRole] = useState('patient');
  const [everDonated,setEverDonated] = useState(false);
  const [lastDonation,setLastDonation] = useState('');
  const [photo, setPhoto] = useState(null);
  const [error,setError] = useState('');
  const [success,setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if(password !== confirm){ setError('Passwords do not match'); return; }
    if(password.length < 6){ setError('Password must be at least 6 chars'); return; }
    if(role === 'donor' && everDonated && !lastDonation){ setError('Please provide last donation date'); return; }

    // Use FormData to send photo as multipart/form-data
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('blood_group', blood);
    formData.append('city', city);
    formData.append('role', role);
    formData.append('ever_donated', everDonated ? 'true' : 'false');
    if(everDonated && lastDonation) formData.append('last_donation', lastDonation);
    if(photo) formData.append('photo', photo);

    try{
      const res = await fetch(`${API_BASE}/users/register/`, {
        method: 'POST',
        // Note: Do NOT set Content-Type header when sending FormData; browser will set boundary
        body: formData
      });
      const data = await res.json();
      if(res.ok){
        setSuccess('Registration successful. Redirecting to dashboard...');
        // Save tokens & user
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));
        // redirect depending on role
        const redirectUrl = (role === 'donor') ? '/dashboard/donor' : '/dashboard/patient';
        // immediate redirect
        navigate(redirectUrl);
      } else {
        setError(JSON.stringify(data));
      }
    } catch(err){
      console.error(err);
      setError('Registration failed.');
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-7">
        <div className="card p-4 shadow bg-primary bg-opacity-10">
          <h3>Register</h3>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-2"><label>Name</label><input value={name} onChange={e=>setName(e.target.value)} className="form-control" required /></div>
            <div className="mb-2"><label>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="form-control" required /></div>
            <div className="mb-2"><label>Blood Group</label>
              <select value={blood} onChange={e=>setBlood(e.target.value)} className="form-select">
                {BLOOD_GROUPS.map(g=> <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="mb-2"><label>City</label><input value={city} onChange={e=>setCity(e.target.value)} className="form-control" required /></div>
            <div className="mb-2"><label>Role</label>
              <select className="form-select" value={role} onChange={e=>setRole(e.target.value)}>
                <option value="patient">Patient</option>
                <option value="donor">Donor</option>
              </select>
            </div>

            {role === 'donor' && (
              <>
                <div className="mb-2">
                  <label>Have you ever donated blood before?</label>
                  <div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="radio" name="ever" checked={!everDonated} onChange={()=>setEverDonated(false)} />
                      <label className="form-check-label">No</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="radio" name="ever" checked={everDonated} onChange={()=>setEverDonated(true)} />
                      <label className="form-check-label">Yes</label>
                    </div>
                  </div>
                </div>
                {everDonated && (
                  <div className="mb-2">
                    <label>Date of Last Donation</label>
                    <input type="date" value={lastDonation} onChange={e=>setLastDonation(e.target.value)} className="form-control" />
                  </div>
                )}
              </>
            )}

            <div className="mb-2">
              <label>Photo (optional)</label>
              <input type="file" accept="image/*" className="form-control" onChange={e=>setPhoto(e.target.files[0])} />
            </div>

            <div className="mb-2"><label>Password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="form-control" required /></div>
            <div className="mb-2"><label>Confirm Password</label><input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} className="form-control" required /></div>
            <button className="btn btn-primary">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
}
