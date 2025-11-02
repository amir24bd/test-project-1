import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUser, clearAuth, isAuthenticated } from '../utils/auth';

export default function Navbar() {
  const user = getUser();
  const navigate = useNavigate();

  function handleLogout() {
    clearAuth();
    navigate('/login');
    window.location.reload();
  }

  const avatar = user?.photo || (user?.name ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=DD3546&color=ffffff` : null);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-danger">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">BMS</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
            {isAuthenticated() && <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>}
          </ul>
          <ul className="navbar-nav">
            {!isAuthenticated() && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
              </>
            )}
            {isAuthenticated() && (
              <>
                <li className="nav-item d-flex align-items-center me-2">
                  {avatar && <img src={avatar} alt="avatar" style={{width:36, height:36, borderRadius:999}} className="me-2" />}
                  <span className="nav-link">{user?.name || user?.username}</span>
                </li>
                <li className="nav-item"><button className="btn btn-sm btn-light" onClick={handleLogout}>Logout</button></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
