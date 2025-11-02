import React from 'react';

export default function DonorCard({profile, onRequest}) {
  // profile has can_donate_now and next_possible_donation and photo/photo_url
  const available = profile.can_donate_now;
  // Prefer photo_url, fallback to photo (relative)
  const imgSrc = profile.photo_url || profile.photo || null;
  const placeholder = 'https://via.placeholder.com/80?text=User';

  return (
    <div className="card mb-3 bg-primary bg-opacity-10">
      <div className="card-body d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <div style={{width:80, height:80, overflow:'hidden', borderRadius:8, marginRight:12}}>
            <img src={imgSrc || placeholder} alt={profile.name} style={{width:'100%', height:'100%', objectFit:'cover'}} />
          </div>
          <div>
            <h5 className="mb-1">{profile.name} <small className="badge bg-danger ms-2">{profile.blood_group}</small></h5>
            <p className="mb-1">{profile.city}</p>
            <small className="text-muted">
              {!available ? `Last blood donate: ${profile.last_donation || 'N/A'} • Can donate again: ${profile.next_possible_donation || 'N/A'}` : 'Available to donate blood.'}
            </small>
          </div>
        </div>

        <div className="text-end">
          <p className="mb-2">{profile.bio ? profile.bio : ''}</p>
          <button className="btn btn-sm btn-primary" disabled={!available} onClick={()=>onRequest(profile)}>
            Request
          </button>
        </div>
      </div>
    </div>
  );
}
