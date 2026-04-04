import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './main.css';

const ICONS = {
  home: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  funds: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  trophy: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 21h8M12 17v4M7 4h10a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
      <circle cx="12" cy="11" r="3" />
    </svg>
  ),
  profile: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  bell: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9z" />
      <path d="M13.73 21a1.94 1.94 0 0 1-3.46 0" />
    </svg>
  ),
};

function App() {
  const [page, setPage] = useState('home');
  const [balance, setBalance] = useState(1250);
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'deposit', amount: 500, date: 'Today', status: 'Completed' },
    { id: 2, type: 'win', amount: 350, date: 'Yesterday', status: 'Completed' },
    { id: 3, type: 'withdraw', amount: -200, date: 'Mar 30', status: 'Completed' },
  ]);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const accountName = "Ryno_King_Sir";

  const showNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleDeposit = (amount) => {
    if (!amount || amount < 50) {
      showNotification("Minimum deposit is ৳50");
      return;
    }
    setBalance(prev => prev + Number(amount));
    setTransactions(prev => [{
      id: Date.now(),
      type: 'deposit',
      amount: Number(amount),
      date: 'Just now',
      status: 'Completed'
    }, ...prev]);
    showNotification(`৳${amount} deposited successfully via bKash!`);
  };

  const handleWithdraw = (amount, wallet) => {
    if (!amount || amount < 50) {
      showNotification("Minimum withdrawal is ৳50");
      return;
    }
    if (amount > balance) {
      showNotification("Insufficient balance!");
      return;
    }
    if (!wallet || !wallet.startsWith('01')) {
      showNotification("Please enter valid bKash number");
      return;
    }

    setBalance(prev => prev - Number(amount));
    setTransactions(prev => [{
      id: Date.now(),
      type: 'withdraw',
      amount: -Number(amount),
      date: 'Just now',
      status: 'Pending'
    }, ...prev]);
    showNotification(`Withdrawal request of ৳${amount} sent to ${wallet}`);
  };

  // Mobile bottom nav
  const BottomNav = () => (
    <div className="bottom-nav">
      <button onClick={() => setPage('home')} className={`nav-item ${page === 'home' ? 'active' : ''}`}>
        {ICONS.home}
        <span>Home</span>
      </button>
      <button onClick={() => setPage('funds')} className={`nav-item ${page === 'funds' ? 'active' : ''}`}>
        {ICONS.funds}
        <span>Funds</span>
      </button>
      <button onClick={() => setPage('tournament')} className={`nav-item ${page === 'tournament' ? 'active' : ''}`}>
        {ICONS.trophy}
        <span>Tournaments</span>
      </button>
      <button onClick={() => setPage('profile')} className={`nav-item ${page === 'profile' ? 'active' : ''}`}>
        {ICONS.profile}
        <span>Profile</span>
      </button>
    </div>
  );

  return (
    <div className="app">
      {/* Sidebar - Desktop only */}
      <aside className="sidebar">
        <div className="logo" onClick={() => setPage('home')}>R</div>
        <nav className="nav-menu">
          <button className={`nav-btn ${page === 'home' ? 'active' : ''}`} onClick={() => setPage('home')}>
            {ICONS.home}
          </button>
          <button className={`nav-btn ${page === 'funds' ? 'active' : ''}`} onClick={() => setPage('funds')}>
            {ICONS.funds}
          </button>
          <button className={`nav-btn ${page === 'tournament' ? 'active' : ''}`} onClick={() => setPage('tournament')}>
            {ICONS.trophy}
          </button>
          <button className={`nav-btn ${page === 'profile' ? 'active' : ''}`} onClick={() => setPage('profile')}>
            {ICONS.profile}
          </button>
        </nav>
      </aside>

      <main className="main">
        <header className="header">
          <div className="header-left">
            <h1>Ryno Dashboard</h1>
            <span className="breadcrumb">Welcome, {accountName}</span>
          </div>

          <div className="header-right">
            <div className="balance-pill">
              <span className="currency">৳</span>
              <span className="amount">{balance}</span>
              <span className="currency-small"> BDT</span>
            </div>
            <button className="icon-btn">{ICONS.bell}</button>
          </div>
        </header>

        <div className="content-area">
          {/* HOME PAGE */}
          {page === 'home' && (
            <div className="fade-in">
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-value">৳{balance}</span>
                  <span className="stat-label">Current Balance</span>
                </div>
                <div className="stat-card">
                  <span className="stat-value" style={{ fontSize: '18px' }}>{accountName}</span>
                  <span className="stat-label">Verified Player</span>
                </div>
              </div>

              <h2 className="section-title">Live Tournaments</h2>
              <div className="tournaments-grid">
                {[1, 2, 3].map(id => (
                  <div key={id} className="tournament-card">
                    <h3>Squad • Bermuda</h3>
                    <div className="meta-row">
                      <span>Entry: <strong>৳30</strong></span>
                      <span>Prize: <strong>৳1,200</strong></span>
                    </div>
                    <button className="join-btn">Join Match</button>
                  </div>
                ))}
              </div>

              <h2 className="section-title" style={{ marginTop: '40px' }}>Recent Activity</h2>
              <div className="transactions-list">
                {transactions.slice(0, 4).map(tx => (
                  <div key={tx.id} className="transaction-item">
                    <div>
                      <strong>{tx.type === 'deposit' ? 'Deposit' : tx.type === 'win' ? 'Tournament Win' : 'Withdrawal'}</strong>
                      <p>{tx.date}</p>
                    </div>
                    <span className={`amount ${tx.amount > 0 ? 'positive' : 'negative'}`}>
                      {tx.amount > 0 ? '+' : ''}৳{Math.abs(tx.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FUNDS PAGE - Only bKash */}
          {page === 'funds' && (
            <div className="funds-container fade-in">
              <div className="form-card">
                <h2>Add Funds (bKash)</h2>
                <p className="subtitle">Minimum: ৳50 • Instant Credit</p>
                <input
                  type="number"
                  id="depositAmount"
                  placeholder="Amount in BDT"
                  className="input-field"
                />
                <button
                  className="primary-btn deposit"
                  onClick={() => {
                    const amount = document.getElementById('depositAmount').value;
                    handleDeposit(amount);
                    document.getElementById('depositAmount').value = '';
                  }}
                >
                  Deposit via bKash
                </button>
                <p className="help-text">Send money to bKash: 017XXXXXXXX</p>
              </div>

              <div className="form-card" style={{ marginTop: '20px' }}>
                <h2>Withdraw to bKash</h2>
                <p className="subtitle">Available: ৳{balance}</p>
                <input
                  type="number"
                  id="withdrawAmount"
                  placeholder="Amount to Withdraw"
                  className="input-field"
                />
                <input
                  type="text"
                  id="bKashNumber"
                  placeholder="bKash Number (01XXXXXXXXX)"
                  className="input-field"
                  maxLength="11"
                />
                <button
                  className="primary-btn withdraw"
                  onClick={() => {
                    const amount = document.getElementById('withdrawAmount').value;
                    const wallet = document.getElementById('bKashNumber').value;
                    handleWithdraw(amount, wallet);
                    document.getElementById('withdrawAmount').value = '';
                    document.getElementById('bKashNumber').value = '';
                  }}
                >
                  Request Withdrawal
                </button>
              </div>
            </div>
          )}

          {/* TOURNAMENTS PAGE */}
          {page === 'tournament' && (
            <div className="fade-in">
              <h2 className="section-title">All Tournaments</h2>
              <div className="tournaments-grid">
                {[1, 2, 3, 4, 5].map(id => (
                  <div key={id} className="tournament-card">
                    <h3>Squad Battle • {id % 2 === 0 ? 'Miramar' : 'Bermuda'}</h3>
                    <div className="meta-row">
                      <span>Entry: <strong>৳{20 + id * 10}</strong></span>
                      <span>Prize Pool: <strong>৳{800 + id * 300}</strong></span>
                    </div>
                    <div className="meta-row">
                      <span>Players: 48/64</span>
                      <span>Starts in: 12m</span>
                    </div>
                    <button className="join-btn">Join Now</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROFILE PAGE */}
          {page === 'profile' && (
            <div className="form-card fade-in">
              <h2>My Profile</h2>
              <div className="profile-info">
                <p><strong>Name:</strong> {accountName}</p>
                <p><strong>Region:</strong> Bangladesh</p>
                <p><strong>Status:</strong> <span style={{ color: '#22c55e' }}>● Online</span></p>
                <p><strong>Joined:</strong> March 2025</p>
                <p><strong>Total Matches:</strong> 124</p>
                <p><strong>Win Rate:</strong> 68%</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Toast Notification */}
      {showToast && (
        <div className="toast">{toastMessage}</div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
