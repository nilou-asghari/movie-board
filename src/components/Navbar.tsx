import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <span className="logo-icon">🎬</span>
        <span className="logo-text">CineBoard</span>
      </Link>

      <div className="navbar-links">
        <Link to="/" className="nav-link">
          Discover
        </Link>
        {user && (
          <Link to="/favorites" className="nav-link">
            My List
          </Link>
        )}
      </div>

      <div className="navbar-auth">
        {user ? (
          <div className="user-menu">
            <button className="user-btn" onClick={() => setMenuOpen(!menuOpen)}>
              <span className="user-avatar">{user.email[0].toUpperCase()}</span>
              <span className="user-email">{user.email}</span>
              <span className="chevron">{menuOpen ? "▲" : "▼"}</span>
            </button>
            {menuOpen && (
              <div className="dropdown">
                <Link
                  to="/favorites"
                  className="dropdown-item"
                  onClick={() => setMenuOpen(false)}>
                  ♥ My Favorites
                </Link>
                <button
                  className="dropdown-item logout-btn"
                  onClick={handleLogout}>
                  ⎋ Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="auth-btns">
            <Link to="/login" className="btn-ghost">
              Sign In
            </Link>
            <Link to="/register" className="btn-primary">
              Join Free
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
