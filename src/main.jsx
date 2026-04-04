import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './main.css';

// --- Icons ---
const ICONS = {
  home: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  deposit: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  withdraw: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>,
  profile: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
};

function App() {
  const [page, setPage] = useState('home');
  const [balance, setBalance] = useState(1250);

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo" onClick={() => setPage('home')}>R</div>
        <nav className="nav-menu">
          <button className={`nav-btn ${page === 'home' ? 'active' : ''}`} onClick={() => setPage('home')}>{ICONS.home}</button>
          <button className={`nav-btn ${page === 'cash' ? 'active' : ''}`} onClick={() => setPage('cash')}>{ICONS.deposit}</button>
          <button className={`nav-btn ${page === 'profile' ? 'active' : ''}`} onClick={() => setPage('profile')}>{ICONS.profile}</button>
        </nav>
      </aside>

      <main className="main">
        <header className="header">
          <div className="header-left">
            <h1>Ryno Dashboard</h1>
            <span className="breadcrumb">Ready for Battle, Sir</span>
          </div>
          <div className="balance-pill">
            <span className="currency">₹</span>
            <span className="amount">{balance}</span>
          </div>
        </header>

        <div className="content-area">
          {page === 'home' && (
            <div className="fade-in">
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-value">₹{balance}</span>
                  <span className="stat-label">Wallet</span>
                </div>
                <div className="stat-card">
                  <span className="stat-value">14</span>
                  <span className="stat-label">Total Wins</span>
                </div>
              </div>
              <h2 className="section-title">Upcoming Matches</h2>
              <div className="tournaments-grid">
                {[1, 2, 3].map(id => (
                  <div key={id} className="tournament-card">
                    <h3>Squad • Bermuda</h3>
                    <div className="meta-row"><span>₹30 Entry</span><span>₹1200 Prize</span></div>
                    <button className="join-btn">Join Match</button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {page === 'cash' && (
            <div className="form-card fade-in">
              <h2>Add Funds</h2>
              <input type="number" placeholder="Amount" className="input-field" style={{display:'block', width:'100%', padding:'12px', background:'#09090d', border:'1px solid #252533', color:'white', borderRadius:'8px', margin:'20px 0'}} />
              <button className="primary-btn" style={{width:'100%', padding:'12px', background:'#f59e0b', border:'none', borderRadius:'8px', fontWeight:'bold', cursor:'pointer'}}>Pay Now</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Render the application
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
