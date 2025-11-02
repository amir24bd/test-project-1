// src/components/Header.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load user info from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
      } catch (e) {
        console.error("Failed to parse user data:", e);
        setUser(null);
      }
    }
  }, []);

  // Listen for changes in localStorage (so other components can trigger updates)
  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  // Determine dashboard route based on user role
  const getDashboardLink = () => {
    if (!user) return "/";
    if (user.is_staff) return "/dashboard/admin";
    if (user.profile && user.profile.role === "donor") return "/dashboard/donor";
    if (user.profile && user.profile.role === "patient")
      return "/dashboard/patient";
    return "/";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#442275'}}>
      <div className="container">
        <Link className="navbar-brand text-warning" to="/">
          BMS
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>

            {/* Show Dashboard when user is logged in */}
            {user && (
              <li className="nav-item">
                <Link className="nav-link" to={getDashboardLink()}>
                  Dashboard
                </Link>
              </li>
            )}
          </ul>

          <ul className="navbar-nav">
            {/* Not logged in */}
            {!user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}

            {/* Logged in */}
            {user && (
              <>
                <li className="nav-item d-flex align-items-center text-white me-3">
                  <div style={{ lineHeight: "1" }}>
                    <strong>
                      {user.profile?.name || user.username || user.email}
                    </strong>
                  </div>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-light btn-sm"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
