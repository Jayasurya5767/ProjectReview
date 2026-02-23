import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ links, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout?.();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to={links[0]?.path || '/'} className="navbar-brand">
        Assignment System
      </Link>
      <ul className="navbar-nav">
        {links.map((link) => (
          <li key={link.path}>
            <Link to={link.path} className="nav-link">
              {link.label}
            </Link>
          </li>
        ))}
        <li>
          <button onClick={handleLogout} className="nav-link logout-btn">
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}
