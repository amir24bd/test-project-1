import React, { useState } from 'react';
import api from '../api';
import { saveAuth } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({
    name:'', email:'', password:'', blood_group:'', city:'', role:'patient', ever_donated:false, last_donation:''
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isDonor = form.role === 'donor';

  function change(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({...prev, [name]: type==='checkbox' ? checked : value}));
  }

  function handleFile(e) {
    const f = e.target.files && e.target.files[0];
    setPhotoFile(f || null);
  }

  async function submit(e) {
    e.preventDefault();
    // basic validation
    if (!form.name || !form.email || !form.password || !form.blood_group || !form.city) {
      alert('Please complete required fields.');
      return;
    }
    if (isDonor && form.ever_donated && !form.last_donation) {
      alert('Please provide last donation date');
      return;
    }
    setLoading(true);
    try {
      // If a photo is present, send FormData; otherwise JSON
      let res;
      if (photoFile) {
        const fd = new FormData();
        fd.append('name', form.name);
        fd.append('email', form.email);
        fd.append('password', form.password);
        fd.append('blood_group', form.blood_group);
        fd.append('city', form.city);
        fd.append('role', form.role);
        fd.append('ever_donated', form.ever_donated ? 'true' : 'false');
        if (form.last_donation) fd.append('last_donation', form.last_donation);
        fd.append('photo', photoFile);
        res = await api.register(fd);
      } else {
        const payload = {
          name: form.name,
          email: form.email,
          password: form.password,
          blood_group: form.blood_group,
          city: form.city,
          role: form.role,
          ever_donated: form.ever_donated,
          last_donation: form.last_donation || null
        };
        res = await api.register(payload);
      }
      // backend returns access & refresh + user
      saveAuth(res);
      navigate('/');
      window.location.reload();
    } catch (err) {
      // try to show helpful error message
      const msg = err?.data || err?.data?.email || err?.message || JSON.stringify(err);
      alert(msg);
    } finally { setLoading(false); }
  }

  return (
    <div className="container py-4">
      <div className="card mx-auto" style={{maxWidth:700}}>
        <div className="card-body">
          <h3 className="card-title mb-3">Register</h3>
          <form onSubmit={submit} encType="multipart/form-data">
            <div className="row g-2">
              <div className="col-md-6">
                <label className="form-label">Your Name</label>
                <input name="name" value={form.name} onChange={change} className="form-control" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input type="email" name="email" value={form.email} onChange={change} className="form-control" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Password</label>
                <input type="password" name="password" value={form.password} onChange={change} className="form-control" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Blood Group</label>
                <select name="blood_group" value={form.blood_group} onChange={change} className="form-select">
                  <option value="">Select</option>
                  {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Living City</label>
                <input name="city" value={form.city} onChange={change} className="form-control" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Role</label>
                <select name="role" value={form.role} onChange={change} className="form-select">
                  <option value="patient">Patient</option>
                  <option value="donor">Donor</option>
                </select>
              </div>

              {isDonor && (
                <>
                  <div className="col-12">
                    <label className="form-label">Have you ever donated blood before?</label>
                    <div>
                      <div className="form-check form-check-inline">
                        <input className="form-check-input" type="checkbox" name="ever_donated" checked={form.ever_donated} onChange={change} />
                        <label className="form-check-label">Yes</label>
                      </div>
                    </div>
                  </div>
                  {form.ever_donated && (
                    <div className="col-md-6">
                      <label className="form-label">Last donation date</label>
                      <input type="date" name="last_donation" value={form.last_donation} onChange={change} className="form-control" />
                    </div>
                  )}
                </>
              )}

              <div className="col-md-6">
                <label className="form-label">Upload Photo (optional)</label>
                <input type="file" accept="image/*" onChange={handleFile} className="form-control" />
              </div>

              <div className="col-12 mt-3">
                <button className="btn btn-danger" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
