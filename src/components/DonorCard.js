import React from 'react';
import { Link } from 'react-router-dom';

export default function DonorCard({ profile, onRequestClick }) {
  const canDonate = profile.can_donate_now;
  const nextDate = profile.next_possible_donation;
  // photo from backend is absolute URL (if backend had request in serializer context)
  const avatar = profile.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=DD3546&color=ffffff`;

  return (
    <div className="card mb-3">
      <div className="card-body d-flex">
        <div style={{width: 110}}>
          <img src={avatar} alt="profile" className="img-fluid rounded-circle" style={{width:100, height:100, objectFit:'cover'}} />
        </div>
        <div className="ms-3 flex-grow-1">
          <h5>{profile.name} <small className="badge bg-secondary ms-2">{profile.blood_group}</small></h5>
          <p className="mb-1"><strong>City:</strong> {profile.city}</p>
          <p className="mb-1">{profile.bio ? profile.bio.substring(0,120) : ''}</p>
          <p className="mb-1">
            {canDonate ? (
              <span className="text-success">Available to donate now</span>
            ) : (
              <span className="text-warning">Next available: {nextDate ? new Date(nextDate).toLocaleDateString() : '—'}</span>
            )}
          </p>
        </div>
        <div className="d-flex flex-column align-items-end">
          <Link to={`/profiles/${profile.id}`} className="btn btn-outline-primary mb-2">View</Link>
          <button disabled={!canDonate} className="btn btn-danger" onClick={() => onRequestClick(profile)}>
            Request
          </button>
        </div>
      </div>
    </div>
  );
}
