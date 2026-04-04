import React, { useState, useRef } from 'react';
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
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9z" />
      <path d="M13.73 21a1.94 1.94 0 0 1-3.46 0" />
    </svg>
  ),
};

function App() {
  const [page, setPage] = useState('home');
  const [balance, setBalance] = useState(1250);
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'win', amount: 450, date: 'Today', status: 'Completed' },
    { id: 2, type: 'deposit', amount: 500, date: 'Yesterday', status: 'Completed' },
    { id: 3, type: 'withdraw', amount: -300, date: 'Mar 31', status: 'Completed' },
  ]);
  const [toast, setToast] = useState({ show: false, message: '' });
  
  // Refs for form inputs (React best practice)
  const depositAmountRef = useRef(null);
  const withdrawAmountRef = useRef(null);
  const bKashNumberRef = useRef(null);
  
  const accountName = "Ryno_King_Sir";

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 2800);
  };

  const handleDeposit = () => {
    const amount = parseInt(depositAmountRef.current?.value);

    if (!amount || amount < 50) {
      showToast("Minimum deposit amount is ৳50");
      return;
    }

    setBalance(prev => prev + amount);
    setTransactions(prev => [{
      id: Date.now(),
      type: 'deposit',
      amount: amount,
      date: 'Just now',
      status: 'Completed'
    }, ...prev]);

    showToast(`৳${amount} added successfully via bKash!`);
    if (depositAmountRef.current) depositAmountRef.current.value = '';
  };

  const handleWithdraw = () => {
    const amount = parseInt(withdrawAmountRef.current?.value);
    const number = bKashNumberRef.current?.value.trim();

    if (!amount || amount < 50) {
      showToast("Minimum withdrawal is ৳50");
      return;
    }
    if (amount > balance) {
      showToast("Insufficient balance!");
      return;
    }
    if (!number || number.length < 11 || !number.startsWith('01')) {
      showToast("Enter valid bKash number (01XXXXXXXXX)");
      return;
    }

    setBalance(prev => prev - amount);
    setTransactions(prev => [{
      id: Date.now(),
      type: 'withdraw',
      amount: -amount,
      date: 'Just now',
      status: 'Pending'
    }, ...prev]);

    showToast(`Withdrawal request of ৳${amount} sent to ${number}`);
    if (withdrawAmountRef.current) withdrawAmountRef.current.value = '';
    if (bKashNumberRef.current) bKashNumberRef.current.value = '';
  };

  return (
    <div className="app">
      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <div className="logo" onClick={() => setPage('home')}>R</div>
        <nav className="nav-menu">
          <button className={`nav-btn ${page === 'home' ? 'active' : ''}`} onClick={() => setPage('home')} aria-label="Home">
            {ICONS.home}
          </button>
          <button className={`nav-btn ${page === 'funds' ? 'active' : ''}`} onClick={() => setPage('funds')} aria-label="Funds">
            {ICONS.funds}
          </button>
          <button className={`nav-btn ${page === 'tournament' ? 'active' : ''}`} onClick={() => setPage('tournament')} aria-label="Tournaments">
            {ICONS.trophy}
          </button>
          <button className={`nav-btn ${page === 'profile' ? 'active' : ''}`} onClick={() => setPage('profile')} aria-label="Profile">
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
              <span className="amount">{balance.toLocaleString()}</span>
              <span className="currency-small"> BDT</span>
            </div>
            <button className="icon-btn" aria-label="Notifications">{ICONS.bell}</button>
          </div>
        </header>

        <div className="content-area">
          {/* HOME PAGE */}
          {page === 'home' && (
            <div className="fade-in">
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-value">৳{balance.toLocaleString()}</span>
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
                    <div className="meta-row">
                      <span>Entry: <strong>৳30</strong></span>
                      <span>Prize: <strong>৳1,200</strong></span>
                    </div>
                    <button className="join-btn">Join Match</button>
                  </div>
                ))}
              </div>

              <h2 className="section-title">Recent Activity</h2>
              <div className="transactions-list">
                {transactions.map(tx => (
                  <div key={tx.id} className="transaction-item">
                    <div>
                      <strong>
                        {tx.type === 'deposit' ? 'Deposit via bKash' : 
                         tx.type === 'win' ? 'Tournament Win' : 'Withdrawal to bKash'}
                      </strong>
                      <p className="tx-date">{tx.date} • {tx.status}</p>
                    </div>
                    <span className={`tx-amount ${tx.amount > 0 ? 'positive' : 'negative'}`}>
                      {tx.amount > 0 ? '+' : ''}৳{Math.abs(tx.amount).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FUNDS PAGE - ONLY BKASH */}
          {page === 'funds' && (
            <div className="funds-container fade-in">
              <div className="form-card">
                <h2>Deposit via bKash</h2>
                <p className="subtitle">Minimum: ৳50 • Instant Credit</p>
                <input 
                  type="number" 
                  ref={depositAmountRef}
                  placeholder="Amount in BDT" 
                  className="input-field" 
                  min="50"
                />
                <button className="primary-btn deposit" onClick={handleDeposit}>
                  Deposit Now
                </button>
                <p className="help-text">Send money to: <strong>01711-234567</strong></p>
              </div>

              <div className="form-card" style={{marginTop: '24px'}}>
                <h2>Withdraw to bKash</h2>
                <p className="subtitle">Available: ৳{balance.toLocaleString()}</p>
                <input 
                  type="number" 
                  ref={withdrawAmountRef}
                  placeholder="Amount to withdraw" 
                  className="input-field" 
                  min="50"
                />
                <input 
                  type="tel" 
                  ref={bKashNumberRef}
                  placeholder="bKash Number (01XXXXXXXXX)" 
                  className="input-field" 
                  maxLength="11" 
                  pattern="^01[0-9]{9}$"
                />
                <button className="primary-btn withdraw" onClick={handleWithdraw}>
                  Request Withdrawal
                </button>
              </div>
            </div>
          )}

          {/* TOURNAMENTS PAGE */}
          {page === 'tournament' && (
            <div className="fade-in">
              <h2 className="section-title">Available Tournaments</h2>
              <div className="tournaments-grid">
                {[1,2,3,4,5].map(id => (
                  <div key={id} className="tournament-card">
                    <h3>Squad Battle • {id % 2 === 0 ? "Miramar" : "Bermuda"}</h3>
                    <div className="meta-row">
                      <span>Entry: <strong>৳{30 + id*10}</strong></span>
                      <span>Prize Pool: <strong>৳{900 + id*400}</strong></span>
                    </div>
                    <div className="meta-row">
                      <span>48/64 Players</span>
                      <span>Starts in 18 min</span>
                    </div>
                    <button className="join-btn">Join Tournament</button>
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
                <p><strong>Status:</strong> <span className="status-online">● Online</span></p>
                <p><strong>Joined:</strong> March 2025</p>
                <p><strong>Total Matches:</strong> 137</p>
                <p><strong>Win Rate:</strong> 71%</p>
                <p><strong>Favorite Map:</strong> Bermuda</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="bottom-nav" role="navigation">
        <button onClick={() => setPage('home')} className={`nav-item ${page === 'home' ? 'active' : ''}`} aria-label="Home">
          {ICONS.home}<span>Home</span>
        </button>
        <button onClick={() => setPage('funds')} className={`nav-item ${page === 'funds' ? 'active' : ''}`} aria-label="Funds">
          {ICONS.funds}<span>Funds</span>
        </button>
        <button onClick={() => setPage('tournament')} className={`nav-item ${page === 'tournament' ? 'active' : ''}`} aria-label="Tournaments">
          {ICONS.trophy}<span>Tourneys</span>
        </button>
        <button onClick={() => setPage('profile')} className={`nav-item ${page === 'profile' ? 'active' : ''}`} aria-label="Profile">
          {ICONS.profile}<span>Profile</span>
        </button>
      </nav>

      {/* Toast Notification */}
      {toast.show && (
        <div className="toast" role="alert">{toast.message}</div>
      )}
    </div>
  );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
