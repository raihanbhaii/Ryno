import React, { useState } from 'react';
import './App.css';

// Mock Data
const TOURNAMENTS = [
  { id: 1, type: 'Squad', map: 'Bermuda', time: '08:00 PM', entry: 30, prize: 1200, slots: '45/52', status: 'Open' },
  { id: 2, type: 'Duo', map: 'Kalahari', time: '09:30 PM', entry: 20, prize: 600, slots: '38/40', status: 'Almost Full' },
  { id: 3, type: 'Solo', map: 'Purgatory', time: '11:00 PM', entry: 10, prize: 400, slots: '20/50', status: 'Open' },
  { id: 4, type: 'Squad', map: 'Alpine', time: '12:30 AM', entry: 50, prize: 2500, slots: '12/52', status: 'Open' },
];

const ICONS = {
  home: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  deposit: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  withdraw: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>,
  profile: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  trophy: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>,
  gamepad: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" x2="10" y1="11" y2="11"/><line x1="8" x2="8" y1="9" y2="13"/><line x1="15" x2="15.01" y1="12" y2="12"/><line x1="18" x2="18.01" y1="10" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 11.441 2 13.426V15a4 4 0 0 0 4 4h1.112c1.683 0 3.152-.82 4.003-2.125l.41-.64a2 2 0 0 1 3.36 0l.41.64c.85 1.305 2.32 2.125 4.003 2.125H20a4 4 0 0 0 4-4v-1.574c0-1.985-.604-4.01-.685-4.676-.007-.05-.011-.1-.017-.152A4 4 0 0 0 19.32 5Z"/></svg>,
  check: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
};

// Components
const Sidebar = ({ page, setPage }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: ICONS.home },
    { id: 'cashin', label: 'Add Cash', icon: ICONS.deposit },
    { id: 'withdraw', label: 'Withdraw', icon: ICONS.withdraw },
    { id: 'profile', label: 'Profile', icon: ICONS.profile },
  ];

  return (
    <aside className="sidebar">
      <div className="logo" onClick={() => setPage('home')}>R</div>
      <nav className="nav-menu">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-btn ${page === item.id ? 'active' : ''}`}
            onClick={() => setPage(item.id)}
            title={item.label}
          >
            {item.icon}
          </button>
        ))}
      </nav>
    </aside>
  );
};

const Header = ({ balance }) => (
  <header className="header">
    <div className="header-left">
      <h1>Dashboard</h1>
      <span className="breadcrumb">Welcome back, Player</span>
    </div>
    <div className="header-right">
      <div className="balance-pill">
        <span className="currency">₹</span>
        <span className="amount">{balance.toLocaleString('en-IN')}</span>
        <span className="label">Balance</span>
      </div>
      <div className="avatar">P</div>
    </div>
  </header>
);

const StatCard = ({ icon, value, label, color }) => (
  <div className="stat-card" style={{ borderColor: `${color}33` }}>
    <div className="stat-icon" style={{ color }}>{icon}</div>
    <div className="stat-info">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  </div>
);

const TournamentCard = ({ t }) => (
  <div className="tournament-card">
    <div className="card-header">
      <span className={`badge ${t.status === 'Open' ? 'open' : 'full'}`}>{t.status}</span>
      <span className="time">{t.time} IST</span>
    </div>
    <div className="card-body">
      <h3>{t.type} • {t.map}</h3>
      <div className="meta-row">
        <span><strong>₹{t.entry}</strong> Entry</span>
        <span><strong>₹{t.prize}</strong> Prize</span>
        <span><strong>{t.slots}</strong> Slots</span>
      </div>
    </div>
    <button className="join-btn">Join Match</button>
  </div>
);

const HomePage = ({ balance }) => (
  <div className="page fade-in">
    <div className="stats-grid">
      <StatCard icon={ICONS.deposit} value={`₹${balance}`} label="Available Balance" color="#f59e0b" />
      <StatCard icon={ICONS.trophy} value="14" label="Tournaments Won" color="#22c55e" />
      <StatCard icon={ICONS.gamepad} value="47" label="Matches Played" color="#8b5cf6" />
    </div>

    <section className="section">
      <h2 className="section-title">Upcoming Tournaments</h2>
      <div className="tournaments-grid">
        {TOURNAMENTS.map(t => <TournamentCard key={t.id} t={t} />)}
      </div>
    </section>
  </div>
);

const CashInPage = ({ balance, amount, setAmount, onSubmit }) => (
  <div className="page fade-in">
    <h2 className="page-title">Add Cash</h2>
    <div className="form-card">
      <div className="current-balance">Available: <strong>₹{balance.toLocaleString('en-IN')}</strong></div>
      <form onSubmit={onSubmit} className="auth-form">
        <label>Amount (₹)</label>
        <input
          type="number"
          placeholder="Enter amount (Min: ₹50)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="50"
          required
        />
        <div className="quick-amounts">
          {[50, 100, 250, 500, 1000].map(v => (
            <button type="button" key={v} onClick={() => setAmount(v)} className="pill">₹{v}</button>
          ))}
        </div>
        <label>Payment Method</label>
        <select className="input">
          <option>UPI (GPay/PhonePe/Paytm)</option>
          <option>Net Banking</option>
          <option>Debit Card</option>
        </select>
        <button type="submit" className="primary-btn">Proceed to Pay</button>
      </form>
      <p className="note">⏱️ Funds are added instantly after successful payment.</p>
    </div>
  </div>
);

const WithdrawPage = ({ balance, amount, setAmount, upi, setUpi, onSubmit }) => (
  <div className="page fade-in">
    <h2 className="page-title">Withdraw Winnings</h2>
    <div className="form-card">
      <div className="current-balance">Withdrawable: <strong>₹{balance.toLocaleString('en-IN')}</strong></div>
      <form onSubmit={onSubmit} className="auth-form">
        <label>Amount (₹)</label>
        <input
          type="number"
          placeholder="Enter amount (Min: ₹100)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="100"
          max={balance}
          required
        />
        <label>UPI ID / VPA</label>
        <input
          type="text"
          placeholder="yourname@upi"
          value={upi}
          onChange={(e) => setUpi(e.target.value)}
          className="input"
          required
        />
        <button type="submit" className="primary-btn withdraw">Request Withdrawal</button>
      </form>
      <div className="rules">
        <h4>⚠️ Withdrawal Rules</h4>
        <ul>
          <li>Minimum withdrawal: ₹100</li>
          <li>Processed within 0-2 hours</li>
          <li>Ensure UPI ID is correct. Ryno is not liable for wrong details.</li>
        </ul>
      </div>
    </div>
  </div>
);

const ProfilePage = () => (
  <div className="page fade-in">
    <h2 className="page-title">My Profile</h2>
    <div className="form-card profile-card">
      <div className="profile-header">
        <div className="avatar-large">R</div>
        <div>
          <h3>RynoPlayer_01</h3>
          <p className="uid">UID: 8293019482</p>
        </div>
      </div>
      <div className="info-grid">
        <div className="info-item"><span>Registered</span><strong>Apr 2025</strong></div>
        <div className="info-item"><span>Account Status</span><strong style={{color:'#22c55e'}}>Verified</strong></div>
        <div className="info-item"><span>Referral Code</span><strong>RYNO88</strong></div>
        <div className="info-item"><span>Support</span><strong>support@ryno.gg</strong></div>
      </div>
    </div>
  </div>
);

// Toast Notification
const Toast = ({ message }) => (
  <div className="toast">
    <span style={{color: '#22c55e', marginRight: '8px'}}>{ICONS.check}</span>
    {message}
  </div>
);

export default function App() {
  const [page, setPage] = useState('home');
  const [balance, setBalance] = useState(1250);
  const [cashAmt, setCashAmt] = useState('');
  const [withdrawAmt, setWithdrawAmt] = useState('');
  const [upi, setUpi] = useState('');
  const [toast, setToast] = useState(null);

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCashIn = (e) => {
    e.preventDefault();
    const amt = parseFloat(cashAmt);
    if (amt && amt >= 50) {
      setBalance(prev => prev + amt);
      notify(`₹${amt} added successfully!`);
      setCashAmt('');
    } else notify('Minimum deposit is ₹50');
  };

  const handleWithdraw = (e) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmt);
    if (!upi.includes('@')) return notify('Invalid UPI ID');
    if (amt >= 100 && amt <= balance) {
      setBalance(prev => prev - amt);
      notify(`₹${amt} withdrawal requested!`);
      setWithdrawAmt('');
      setUpi('');
    } else if (amt > balance) notify('Insufficient balance');
    else notify('Minimum withdrawal is ₹100');
  };

  return (
    <div className="app">
      <Sidebar page={page} setPage={setPage} />
      <main className="main">
        <Header balance={balance} />
        {toast && <Toast message={toast} />}
        {page === 'home' && <HomePage balance={balance} />}
        {page === 'cashin' && <CashInPage balance={balance} amount={cashAmt} setAmount={setCashAmt} onSubmit={handleCashIn} />}
        {page === 'withdraw' && <WithdrawPage balance={balance} amount={withdrawAmt} setAmount={setWithdrawAmt} upi={upi} setUpi={setUpi} onSubmit={handleWithdraw} />}
        {page === 'profile' && <ProfilePage />}
      </main>
    </div>
  );
}
