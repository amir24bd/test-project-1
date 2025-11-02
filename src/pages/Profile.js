import React, { useEffect, useState } from 'react';
import api from '../api';
import { getUser } from '../utils/auth';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const user = getUser();
      if (!user) { alert('Not logged'); return; }
      const res = await api.profileDetail(user.id);
      setProfile(res);
      setForm({
        name: res.name || '',
        blood_group: res.blood_group || '',
        city: res.city || '',
        bio: res.bio || '',
        ever_donated: res.ever_donated || false,
        last_donation: res.last_donation || ''
      });
    } catch (err) {
      alert(err.data?.detail || err.message);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

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
    try {
      let res;
      if (photoFile) {
        const fd = new FormData();
        fd.append('name', form.name);
        fd.append('blood_group', form.blood_group);
        fd.append('city', form.city);
        fd.append('bio', form.bio || '');
        fd.append('ever_donated', form.ever_donated ? 'true' : 'false');
        if (form.last_donation) fd.append('last_donation', form.last_donation);
        fd.append('photo', photoFile);
        res = await api.updateProfile(fd);
      } else {
        const payload = {
          name: form.name,
          blood_group: form.blood_group,
          city: form.city,
          bio: form.bio,
          ever_donated: form.ever_donated,
          last_donation: form.last_donation || null
        };
        res = await api.updateProfile(payload);
      }
      alert('Updated');
      setProfile(res);
    } catch (err) {
      alert(err.data?.detail || err.message);
    }
  }

  if (loading || !profile) return <div className="container py-4">Loading...</div>;

  const avatar = profile.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=DD3546&color=ffffff`;

  return (
    <div className="container py-4">
      <h3>My Profile</h3>
      <div className="row">
        <div className="col-md-4">
          <img src={avatar} className="img-fluid rounded" alt="avatar" style={{objectFit:'cover', width:'100%', maxHeight:320}} />
          <h5 className="mt-2">{profile.name}</h5>
          <p>{profile.blood_group} • {profile.city}</p>
          <p>{profile.bio}</p>
        </div>
        <div className="col-md-8">
          <form onSubmit={submit} encType="multipart/form-data">
            <div className="mb-2">
              <label className="form-label">Name</label>
              <input name="name" value={form.name} onChange={change} className="form-control" />
            </div>
            <div className="mb-2">
              <label className="form-label">Blood Group</label>
              <select name="blood_group" value={form.blood_group} onChange={change} className="form-select">
                {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(b=> <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="mb-2">
              <label className="form-label">City</label>
              <input name="city" value={form.city} onChange={change} className="form-control" />
            </div>
            <div className="mb-2 form-check">
              <input className="form-check-input" type="checkbox" name="ever_donated" checked={form.ever_donated} onChange={change} />
              <label className="form-check-label">Ever donated before?</label>
            </div>
            {form.ever_donated && (
              <div className="mb-2">
                <label className="form-label">Last donation</label>
                <input type="date" name="last_donation" value={form.last_donation || ''} onChange={change} className="form-control" />
              </div>
            )}
            <div className="mb-2">
              <label className="form-label">Bio</label>
              <textarea name="bio" value={form.bio} onChange={change} className="form-control"></textarea>
            </div>

            <div className="mb-2">
              <label className="form-label">Change Photo</label>
              <input type="file" accept="image/*" onChange={handleFile} className="form-control" />
            </div>

            <button className="btn btn-primary">Save</button>
          </form>
        </div>
      </div>
    </div>
  );
}
