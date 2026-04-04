import React, { useState } from 'react';
import './main.css';

export default function App() {
  const [page, setPage] = useState('home');
  const [balance, setBalance] = useState(1250);

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">R</div>
        <div className="nav-menu">
          <button onClick={() => setPage('home')} className={`nav-btn ${page === 'home' ? 'active' : ''}`}>H</button>
          <button onClick={() => setPage('cash')} className={`nav-btn ${page === 'cash' ? 'active' : ''}`}>$</button>
          <button onClick={() => setPage('profile')} className={`nav-btn ${page === 'profile' ? 'active' : ''}`}>P</button>
        </div>
      </aside>

      <main className="main">
        <header className="header">
          <div>
            <h1>Dashboard</h1>
            <p style={{color: '#9ca3af'}}>Welcome, Sir</p>
          </div>
          <div className="balance-pill">
            <span className="currency">₹</span>
            <span className="amount">{balance}</span>
          </div>
        </header>

        {page === 'home' && (
          <div className="fade-in">
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-value">₹{balance}</span>
                <span className="stat-label">Wallet Balance</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">14</span>
                <span className="stat-label">Matches Won</span>
              </div>
            </div>

            <h2 style={{marginBottom: '15px'}}>Live Matches</h2>
            <div className="tournaments-grid">
              {[1, 2, 3].map(i => (
                <div key={i} className="t-card">
                  <h3>Squad • Bermuda</h3>
                  <p style={{fontSize: '13px', color: '#9ca3af', margin: '8px 0'}}>Prize: ₹1200 | Entry: ₹30</p>
                  <button className="join-btn">Join Match</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {page === 'cash' && (
          <div className="form-card fade-in">
            <h2>Add Cash</h2>
            <p style={{color: '#9ca3af', marginBottom: '15px'}}>Min deposit: ₹50</p>
            <input type="number" placeholder="Enter Amount" className="input-field" />
            <button className="join-btn">Proceed to Pay</button>
          </div>
        )}

        {page === 'profile' && (
          <div className="form-card fade-in">
            <h2>My Profile</h2>
            <div style={{marginTop: '20px'}}>
              <p><strong>Username:</strong> Ryno_Player</p>
              <p><strong>UID:</strong> 8293019482</p>
              <p style={{color: '#22c55e', marginTop: '10px'}}>✓ Verified Account</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
