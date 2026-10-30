
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const signOut = () => { logout(); setOpen(false); navigate('/'); };

  return (
    <nav className="nav">
      <div className="wrap nav-inner">
        <Link to="/" className="logo" onClick={() => setOpen(false)}>
          <span className="logo-mark">AC</span> AgriConnect
        </Link>

        <div className="nav-links">
          <Link to="/market">Marketplace</Link>
          {user?.role === 'farmer' && <Link to="/dashboard">Dashboard</Link>}
          {user?.role === 'buyer' && <Link to="/orders">My orders</Link>}
        </div>

        <div className="nav-actions">
          {user ? (
            <>
              <span className="nav-user desktop-only">Hi, {user.name.split(' ')[0]} · {user.role}</span>
              <button className="btn btn-ghost desktop-only" onClick={signOut}>Sign out</button>
            </>
          ) : (
            <>
              <Link className="btn btn-ghost desktop-only" to="/login">Sign in</Link>
              <Link className="btn desktop-only" to="/register">Get started</Link>
            </>
          )}
          <button className="menu-btn" aria-label="Open menu" onClick={() => setOpen(v => !v)}>☰</button>
        </div>
      </div>

      <div className={`mobile-menu ${open ? 'open' : ''}`}>
        <Link to="/market" onClick={() => setOpen(false)}>🌾 Marketplace</Link>
        {user?.role === 'farmer' && <Link to="/dashboard" onClick={() => setOpen(false)}>📊 Farmer dashboard</Link>}
        {user?.role === 'buyer' && <Link to="/orders" onClick={() => setOpen(false)}>📦 My orders</Link>}
        {user ? <button onClick={signOut}>↪ Sign out</button> : <>
          <Link to="/login" onClick={() => setOpen(false)}>Sign in</Link>
          <Link to="/register" onClick={() => setOpen(false)}>Create account</Link>
        </>}
      </div>
    </nav>
  );
}
