import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './main.css';

const ICONS = {
  home: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  funds: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  profile: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
};

function App() {
  const [page, setPage] = useState('home');
  const [balance, setBalance] = useState(1250);
  const accountName = "Ryno_King_Sir"; // Your Account Name

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo" onClick={() => setPage('home')}>R</div>
        <nav className="nav-menu">
          <button className={`nav-btn ${page === 'home' ? 'active' : ''}`} onClick={() => setPage('home')}>{ICONS.home}</button>
          <button className={`nav-btn ${page === 'funds' ? 'active' : ''}`} onClick={() => setPage('funds')}>{ICONS.funds}</button>
          <button className={`nav-btn ${page === 'profile' ? 'active' : ''}`} onClick={() => setPage('profile')}>{ICONS.profile}</button>
        </nav>
      </aside>

      <main className="main">
        <header className="header">
          <div className="header-left">
            <h1>Ryno Dashboard</h1>
            <span className="breadcrumb">Welcome, {accountName}</span>
          </div>
          <div className="balance-pill">
            <span className="currency">৳</span>
            <span className="amount">{balance} BDT</span>
          </div>
        </header>

        <div className="content-area">
          {page === 'home' && (
            <div className="fade-in">
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-value">৳{balance}</span>
                  <span className="stat-label">Current Balance</span>
                </div>
                <div className="stat-card">
                  <span className="stat-value" style={{fontSize: '18px'}}>{accountName}</span>
                  <span className="stat-label">Verified Account</span>
                </div>
              </div>
              
              <h2 className="section-title">Live Tournaments</h2>
              <div className="tournaments-grid">
                {[1, 2, 3].map(id => (
                  <div key={id} className="tournament-card">
                    <h3>Squad • Bermuda</h3>
                    <div className="meta-row"><span>Entry: ৳30</span><span>Prize: ৳1200</span></div>
                    <button className="join-btn">Join Match</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {page === 'funds' && (
            <div className="funds-container fade-in">
              <div className="form-card">
                <h2>Add Funds (Deposit)</h2>
                <p className="subtitle">Min: ৳50 BDT</p>
                <input type="number" placeholder="Amount in BDT" className="input-field" />
                <button className="primary-btn deposit">Deposit via bKash/Nagad</button>
              </div>

              <div className="form-card" style={{marginTop: '20px'}}>
                <h2>Withdraw Money</h2>
                <p className="subtitle">Available: ৳{balance}</p>
                <input type="number" placeholder="Amount to Withdraw" className="input-field" />
                <input type="text" placeholder="Wallet Number (bKash/Nagad)" className="input-field" />
                <button className="primary-btn withdraw">Request Withdrawal</button>
              </div>
            </div>
          )}

          {page === 'profile' && (
            <div className="form-card fade-in">
              <h2>My Profile</h2>
              <div className="profile-info">
                <p><strong>Name:</strong> {accountName}</p>
                <p><strong>Region:</strong> Bangladesh</p>
                <p><strong>Status:</strong> Online</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
