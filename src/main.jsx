import { useState, useEffect, useRef } from "react";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  get,
  push,
  update,
  onValue,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// ─── Firebase Init ────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyCl5dpy86CJbmgHwihvs4DjLuLq42w9S1w",
  authDomain: "ryno-fc2a0.firebaseapp.com",
  databaseURL: "https://ryno-fc2a0-default-rtdb.firebaseio.com",
  projectId: "ryno-fc2a0",
  storageBucket: "ryno-fc2a0.firebasestorage.app",
  messagingSenderId: "256737607140",
  appId: "1:256737607140:web:82d12699e41646770ddbf1",
  measurementId: "G-272HSY6B8Y",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const provider = new GoogleAuthProvider();

// ─── Admin UIDs (add UIDs here who should be admins) ─────────────────────────
const ADMIN_UIDS = ["manually-add-uid-here"]; // replaced by DB check

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --white: #ffffff;
    --bg: #f5f6fa;
    --surface: #ffffff;
    --border: #e8eaf0;
    --border-strong: #d0d4df;
    --text: #0d1117;
    --text-sec: #6b7280;
    --text-ter: #9ca3af;
    --accent: #f59e0b;
    --accent-light: #fef3c7;
    --accent-hover: #d97706;
    --success: #10b981;
    --success-light: #d1fae5;
    --danger: #ef4444;
    --danger-light: #fee2e2;
    --info: #3b82f6;
    --info-light: #dbeafe;
    --purple: #8b5cf6;
    --purple-light: #ede9fe;
    --radius: 12px;
    --radius-sm: 8px;
    --radius-lg: 18px;
    --shadow: 0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04);
    --shadow-md: 0 4px 12px rgba(0,0,0,0.08), 0 12px 32px rgba(0,0,0,0.06);
    --shadow-lg: 0 8px 24px rgba(0,0,0,0.1), 0 24px 48px rgba(0,0,0,0.08);
  }

  body {
    font-family: 'Sora', sans-serif;
    background: var(--bg);
    color: var(--text);
    -webkit-font-smoothing: antialiased;
    line-height: 1.6;
  }

  /* ─── AUTH SCREEN ────────────────────────────────────── */
  .auth-screen {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #fff8ed 0%, #f0f4ff 100%);
    padding: 24px;
  }
  .auth-card {
    background: white;
    border-radius: 24px;
    padding: 56px 48px;
    max-width: 420px;
    width: 100%;
    box-shadow: var(--shadow-lg);
    text-align: center;
    border: 1px solid var(--border);
  }
  .auth-logo {
    width: 72px; height: 72px;
    background: var(--accent);
    border-radius: 20px;
    display: grid; place-items: center;
    font-size: 36px; font-weight: 900;
    color: white; margin: 0 auto 28px;
    box-shadow: 0 8px 24px rgba(245,158,11,0.35);
  }
  .auth-card h1 { font-size: 28px; font-weight: 800; margin-bottom: 8px; }
  .auth-card p { color: var(--text-sec); margin-bottom: 36px; font-size: 15px; }
  .google-btn {
    width: 100%;
    padding: 16px 24px;
    background: white;
    border: 2px solid var(--border-strong);
    border-radius: var(--radius);
    font-size: 16px;
    font-weight: 600;
    font-family: 'Sora', sans-serif;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 12px;
    transition: all 0.2s;
    color: var(--text);
  }
  .google-btn:hover { border-color: var(--accent); background: var(--accent-light); transform: translateY(-1px); box-shadow: var(--shadow-md); }
  .google-btn svg { flex-shrink: 0; }

  /* ─── APP LAYOUT ─────────────────────────────────────── */
  .app { display: flex; min-height: 100vh; }

  /* ─── SIDEBAR ────────────────────────────────────────── */
  .sidebar {
    width: 240px; background: white;
    border-right: 1px solid var(--border);
    display: none; flex-direction: column;
    padding: 24px 16px;
    position: sticky; top: 0; height: 100vh;
    z-index: 50; overflow-y: auto;
    flex-shrink: 0;
  }
  .sidebar-logo {
    display: flex; align-items: center; gap: 12px;
    padding: 0 8px; margin-bottom: 36px; cursor: pointer;
  }
  .sidebar-logo-icon {
    width: 40px; height: 40px; background: var(--accent);
    border-radius: 10px; display: grid; place-items: center;
    font-weight: 900; font-size: 22px; color: white;
    flex-shrink: 0;
  }
  .sidebar-logo-text { font-size: 20px; font-weight: 800; }
  .sidebar-logo-text span { color: var(--accent); }
  .sidebar-section { margin-bottom: 24px; }
  .sidebar-section-label {
    font-size: 10px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 1.2px; color: var(--text-ter);
    padding: 0 12px; margin-bottom: 6px; display: block;
  }
  .nav-btn {
    width: 100%; display: flex; align-items: center; gap: 12px;
    padding: 11px 14px; border: none; background: transparent;
    border-radius: var(--radius-sm); cursor: pointer;
    font-size: 14px; font-weight: 500; color: var(--text-sec);
    font-family: 'Sora', sans-serif;
    transition: all 0.18s; text-align: left; margin-bottom: 2px;
  }
  .nav-btn:hover { background: var(--bg); color: var(--text); }
  .nav-btn.active { background: var(--accent-light); color: var(--accent); font-weight: 600; }
  .nav-btn.admin-btn.active { background: var(--purple-light); color: var(--purple); }
  .nav-btn.admin-btn:hover { background: var(--purple-light); color: var(--purple); }
  .sidebar-user {
    margin-top: auto; padding: 16px 12px;
    border-top: 1px solid var(--border);
    display: flex; align-items: center; gap: 12px;
  }
  .sidebar-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    object-fit: cover; flex-shrink: 0;
    border: 2px solid var(--border);
  }
  .sidebar-user-info { flex: 1; min-width: 0; }
  .sidebar-user-name { font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sidebar-user-role { font-size: 11px; color: var(--text-ter); }
  .signout-btn {
    width: 30px; height: 30px; border: 1px solid var(--border);
    border-radius: 8px; background: white; cursor: pointer;
    display: grid; place-items: center; color: var(--text-sec);
    flex-shrink: 0; transition: all 0.18s;
  }
  .signout-btn:hover { background: var(--danger-light); border-color: var(--danger); color: var(--danger); }

  /* ─── MAIN ───────────────────────────────────────────── */
  .main { flex: 1; min-width: 0; display: flex; flex-direction: column; }

  /* ─── TOP BAR ────────────────────────────────────────── */
  .topbar {
    background: white; border-bottom: 1px solid var(--border);
    padding: 14px 20px; display: flex;
    justify-content: space-between; align-items: center;
    position: sticky; top: 0; z-index: 40;
  }
  .topbar-left { display: flex; align-items: center; gap: 12px; }
  .topbar-logo-mobile {
    width: 36px; height: 36px; background: var(--accent);
    border-radius: 10px; display: grid; place-items: center;
    font-weight: 900; font-size: 20px; color: white; cursor: pointer;
  }
  .topbar-title { font-size: 17px; font-weight: 700; }
  .topbar-right { display: flex; align-items: center; gap: 10px; }
  .balance-chip {
    background: var(--accent-light); border: 1px solid #fcd34d;
    border-radius: 30px; padding: 6px 14px;
    font-weight: 700; font-size: 14px; color: #92400e;
    display: flex; align-items: center; gap: 4px;
  }
  .topbar-avatar {
    width: 34px; height: 34px; border-radius: 50%;
    object-fit: cover; border: 2px solid var(--border); cursor: pointer;
  }

  /* ─── PAGE CONTENT ───────────────────────────────────── */
  .page { flex: 1; padding: 28px 24px; max-width: 1100px; width: 100%; margin: 0 auto; padding-bottom: 90px; }
  .fade-in { animation: fadeUp 0.25s ease both; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

  .page-title { font-size: 22px; font-weight: 800; margin-bottom: 6px; }
  .page-subtitle { color: var(--text-sec); font-size: 14px; margin-bottom: 28px; }
  .section-title { font-size: 17px; font-weight: 700; margin: 32px 0 16px; }

  /* ─── CARDS ──────────────────────────────────────────── */
  .card {
    background: white; border: 1px solid var(--border);
    border-radius: var(--radius-lg); padding: 24px;
    box-shadow: var(--shadow); transition: box-shadow 0.2s, transform 0.2s;
  }
  .card:hover { box-shadow: var(--shadow-md); }

  /* ─── STATS ──────────────────────────────────────────── */
  .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 4px; }
  .stat-card { background: white; border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px 24px; box-shadow: var(--shadow); }
  .stat-icon { width: 40px; height: 40px; border-radius: 10px; display: grid; place-items: center; margin-bottom: 14px; }
  .stat-value { font-size: 26px; font-weight: 800; font-family: 'JetBrains Mono', monospace; }
  .stat-label { font-size: 13px; color: var(--text-sec); margin-top: 4px; font-weight: 500; }

  /* ─── TRANSACTIONS ───────────────────────────────────── */
  .tx-list { background: white; border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow); }
  .tx-item { padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); gap: 12px; transition: background 0.15s; }
  .tx-item:hover { background: var(--bg); }
  .tx-item:last-child { border-bottom: none; }
  .tx-icon { width: 36px; height: 36px; border-radius: 10px; display: grid; place-items: center; flex-shrink: 0; }
  .tx-info { flex: 1; min-width: 0; }
  .tx-name { font-size: 14px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .tx-meta { font-size: 12px; color: var(--text-sec); margin-top: 2px; }
  .tx-amount { font-weight: 700; font-size: 15px; font-family: 'JetBrains Mono', monospace; white-space: nowrap; }
  .positive { color: var(--success); }
  .negative { color: var(--danger); }

  /* ─── BADGES ─────────────────────────────────────────── */
  .badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
  .badge-success { background: var(--success-light); color: #065f46; }
  .badge-warning { background: #fef3c7; color: #92400e; }
  .badge-danger { background: var(--danger-light); color: #991b1b; }
  .badge-info { background: var(--info-light); color: #1e40af; }
  .badge-purple { background: var(--purple-light); color: #5b21b6; }

  /* ─── BUTTONS ────────────────────────────────────────── */
  .btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 12px 20px; border: none; border-radius: var(--radius);
    font-size: 14px; font-weight: 600; cursor: pointer;
    font-family: 'Sora', sans-serif; transition: all 0.18s;
    white-space: nowrap;
  }
  .btn-primary { background: var(--accent); color: white; }
  .btn-primary:hover { background: var(--accent-hover); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(245,158,11,0.35); }
  .btn-dark { background: #1f2937; color: white; }
  .btn-dark:hover { background: #111827; transform: translateY(-1px); }
  .btn-danger { background: var(--danger); color: white; }
  .btn-danger:hover { background: #dc2626; }
  .btn-success { background: var(--success); color: white; }
  .btn-success:hover { background: #059669; }
  .btn-outline { background: transparent; border: 1.5px solid var(--border-strong); color: var(--text); }
  .btn-outline:hover { border-color: var(--accent); background: var(--accent-light); color: var(--accent); }
  .btn-sm { padding: 8px 14px; font-size: 12px; border-radius: var(--radius-sm); }
  .btn-full { width: 100%; }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; }

  /* ─── FORMS ──────────────────────────────────────────── */
  .form-group { margin-bottom: 16px; }
  .label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 7px; color: var(--text); }
  .input {
    width: 100%; padding: 12px 14px;
    background: var(--bg); border: 1.5px solid var(--border);
    border-radius: var(--radius-sm); font-size: 14px;
    font-family: 'Sora', sans-serif; color: var(--text);
    transition: all 0.18s;
  }
  .input:focus { outline: none; border-color: var(--accent); background: white; box-shadow: 0 0 0 3px rgba(245,158,11,0.12); }
  .input::placeholder { color: var(--text-ter); }
  .select {
    width: 100%; padding: 12px 14px;
    background: var(--bg); border: 1.5px solid var(--border);
    border-radius: var(--radius-sm); font-size: 14px;
    font-family: 'Sora', sans-serif; color: var(--text);
    cursor: pointer; transition: all 0.18s; appearance: none;
  }
  .select:focus { outline: none; border-color: var(--accent); background: white; }
  .help-text { font-size: 12px; color: var(--text-sec); margin-top: 6px; }

  /* ─── TOURNAMENTS ────────────────────────────────────── */
  .tournaments-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 18px; }
  .tournament-card {
    background: white; border: 1px solid var(--border);
    border-radius: var(--radius-lg); padding: 22px;
    box-shadow: var(--shadow); transition: all 0.2s;
  }
  .tournament-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
  .tc-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; }
  .tc-title { font-size: 16px; font-weight: 700; }
  .tc-map { font-size: 12px; color: var(--text-sec); margin-top: 3px; }
  .tc-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 14px 0; }
  .tc-stat { background: var(--bg); border-radius: 8px; padding: 10px 12px; }
  .tc-stat-val { font-size: 15px; font-weight: 700; font-family: 'JetBrains Mono', monospace; }
  .tc-stat-label { font-size: 11px; color: var(--text-sec); margin-top: 2px; }
  .tc-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 14px; border-top: 1px solid var(--border); }
  .tc-time { font-size: 12px; color: var(--text-sec); display: flex; align-items: center; gap: 4px; }
  .tc-time-live { color: var(--danger); font-weight: 600; display: flex; align-items: center; gap: 5px; }
  .live-dot { width: 7px; height: 7px; background: var(--danger); border-radius: 50%; animation: pulse 1.2s infinite; }
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }

  /* ─── WITHDRAW REQUESTS ──────────────────────────────── */
  .wr-item {
    background: white; border: 1px solid var(--border);
    border-radius: var(--radius); padding: 16px 20px;
    display: flex; justify-content: space-between; align-items: center;
    box-shadow: var(--shadow); margin-bottom: 12px; gap: 16px; flex-wrap: wrap;
  }
  .wr-info { flex: 1; min-width: 0; }
  .wr-name { font-weight: 600; font-size: 14px; }
  .wr-meta { font-size: 12px; color: var(--text-sec); margin-top: 4px; }
  .wr-amount { font-size: 18px; font-weight: 800; font-family: 'JetBrains Mono', monospace; color: var(--danger); white-space: nowrap; }
  .wr-actions { display: flex; gap: 8px; flex-shrink: 0; }

  /* ─── ADMIN TABLE ────────────────────────────────────── */
  .admin-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
  .admin-table th { background: var(--bg); padding: 11px 14px; text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.7px; color: var(--text-sec); border-bottom: 1px solid var(--border); }
  .admin-table td { padding: 13px 14px; border-bottom: 1px solid var(--border); vertical-align: middle; }
  .admin-table tr:last-child td { border-bottom: none; }
  .admin-table tr:hover td { background: var(--bg); }
  .table-wrap { background: white; border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow); overflow-x: auto; }
  .uid-mono { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--text-sec); }

  /* ─── ADMIN TABS ─────────────────────────────────────── */
  .admin-tabs { display: flex; gap: 4px; background: var(--bg); border-radius: var(--radius); padding: 4px; margin-bottom: 28px; flex-wrap: wrap; border: 1px solid var(--border); }
  .admin-tab { padding: 9px 16px; border-radius: 8px; border: none; background: transparent; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Sora', sans-serif; color: var(--text-sec); transition: all 0.18s; white-space: nowrap; }
  .admin-tab.active { background: white; color: var(--purple); box-shadow: var(--shadow); }
  .admin-tab:hover:not(.active) { color: var(--text); }

  /* ─── MODAL ──────────────────────────────────────────── */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.45);
    backdrop-filter: blur(4px); z-index: 999;
    display: flex; align-items: center; justify-content: center; padding: 20px;
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal {
    background: white; border-radius: 20px; padding: 32px;
    max-width: 480px; width: 100%; box-shadow: var(--shadow-lg);
    animation: slideUp 0.25s ease;
  }
  @keyframes slideUp { from { opacity: 0; transform: translateY(16px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
  .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
  .modal-title { font-size: 18px; font-weight: 700; }
  .modal-close { width: 32px; height: 32px; border: 1px solid var(--border); border-radius: 8px; background: white; cursor: pointer; display: grid; place-items: center; font-size: 18px; color: var(--text-sec); transition: all 0.18s; }
  .modal-close:hover { background: var(--danger-light); border-color: var(--danger); color: var(--danger); }

  /* ─── TOAST ──────────────────────────────────────────── */
  .toast {
    position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%);
    background: #1f2937; color: white; padding: 13px 22px;
    border-radius: 12px; font-size: 14px; font-weight: 500;
    box-shadow: var(--shadow-lg); z-index: 9999;
    animation: toastIn 0.3s ease; max-width: 90%; text-align: center;
  }
  .toast.success { background: #065f46; border-left: 4px solid var(--success); }
  .toast.error { background: #991b1b; border-left: 4px solid var(--danger); }
  @keyframes toastIn { from { opacity: 0; transform: translate(-50%, 16px); } to { opacity: 1; transform: translate(-50%, 0); } }

  /* ─── BOTTOM NAV ─────────────────────────────────────── */
  .bottom-nav {
    position: fixed; bottom: 0; left: 0; right: 0;
    background: white; border-top: 1px solid var(--border);
    display: flex; justify-content: space-around;
    padding: 8px 0; padding-bottom: calc(8px + env(safe-area-inset-bottom));
    box-shadow: 0 -2px 12px rgba(0,0,0,0.06); z-index: 100;
  }
  .bnav-btn {
    display: flex; flex-direction: column; align-items: center; gap: 3px;
    border: none; background: none; padding: 6px 12px;
    font-size: 10px; font-weight: 600; font-family: 'Sora', sans-serif;
    color: var(--text-ter); cursor: pointer; border-radius: 10px; transition: all 0.18s;
    min-width: 52px;
  }
  .bnav-btn:hover { color: var(--text-sec); }
  .bnav-btn.active { color: var(--accent); }
  .bnav-btn.admin-nav.active { color: var(--purple); }

  /* ─── DIVIDER ────────────────────────────────────────── */
  .divider { height: 1px; background: var(--border); margin: 20px 0; }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

  /* ─── EMPTY STATE ────────────────────────────────────── */
  .empty { text-align: center; padding: 48px 24px; color: var(--text-sec); }
  .empty-icon { font-size: 40px; margin-bottom: 12px; }
  .empty-title { font-size: 16px; font-weight: 600; margin-bottom: 6px; color: var(--text); }
  .empty-desc { font-size: 13px; }

  /* ─── RESPONSIVE ─────────────────────────────────────── */
  @media (min-width: 768px) {
    .sidebar { display: flex; }
    .bottom-nav { display: none; }
    .page { padding: 32px; padding-bottom: 32px; }
    .topbar-logo-mobile { display: none; }
  }
  @media (max-width: 480px) {
    .two-col { grid-template-columns: 1fr; }
  }
`;

// ─── Icon Components ──────────────────────────────────────────────────────────
const Icon = {
  home: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  funds: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  trophy: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>,
  profile: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  admin: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  signout: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  check: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  x: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  plus: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  bell: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9z"/><path d="M13.73 21a1.94 1.94 0 0 1-3.46 0"/></svg>,
  edit: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  users: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => Number(n || 0).toLocaleString();
const fmtDate = (ts) => {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("en-BD", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
};

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [page, setPage] = useState("home");
  const [toast, setToast] = useState(null);

  // Listen to auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Ensure user doc exists
        const userRef = ref(db, `users/${u.uid}`);
        const snap = await get(userRef);
        if (!snap.exists()) {
          await set(userRef, {
            uid: u.uid,
            name: u.displayName,
            email: u.email,
            photo: u.photoURL,
            balance: 0,
            role: "user",
            joinedAt: serverTimestamp(),
            totalMatches: 0,
            wins: 0,
          });
        }
        // Live user data
        onValue(userRef, (s) => {
          const d = s.val();
          setUserData(d);
          setIsAdmin(d?.role === "admin");
        });
      } else {
        setUserData(null);
        setIsAdmin(false);
      }
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  const showToast = (msg, type = "default") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      showToast("Login failed. Try again.", "error");
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setPage("home");
  };

  if (authLoading) {
    return (
      <>
        <style>{styles}</style>
        <div className="auth-screen">
          <div style={{ textAlign: "center", color: "#6b7280" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⚡</div>
            <div style={{ fontFamily: "Sora, sans-serif", fontWeight: 600 }}>Loading Ryno...</div>
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <style>{styles}</style>
        <div className="auth-screen">
          <div className="auth-card">
            <div className="auth-logo">R</div>
            <h1>Welcome to Ryno</h1>
            <p>Bangladesh's premier gaming tournament platform. Sign in to play, win, and withdraw.</p>
            <button className="google-btn" onClick={handleGoogleLogin}>
              <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </button>
          </div>
        </div>
        {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
      </>
    );
  }

  const navItems = [
    { id: "home", label: "Home", icon: Icon.home },
    { id: "funds", label: "Funds", icon: Icon.funds },
    { id: "tournaments", label: "Tourneys", icon: Icon.trophy },
    { id: "profile", label: "Profile", icon: Icon.profile },
    ...(isAdmin ? [{ id: "admin", label: "Admin", icon: Icon.admin, isAdmin: true }] : []),
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-logo" onClick={() => setPage("home")}>
            <div className="sidebar-logo-icon">R</div>
            <div className="sidebar-logo-text">Ry<span>no</span></div>
          </div>
          <div className="sidebar-section">
            <span className="sidebar-section-label">Menu</span>
            {navItems.filter(n => !n.isAdmin).map((n) => (
              <button key={n.id} className={`nav-btn ${page === n.id ? "active" : ""}`} onClick={() => setPage(n.id)}>
                {n.icon} {n.label}
              </button>
            ))}
          </div>
          {isAdmin && (
            <div className="sidebar-section">
              <span className="sidebar-section-label">Admin</span>
              <button className={`nav-btn admin-btn ${page === "admin" ? "active" : ""}`} onClick={() => setPage("admin")}>
                {Icon.admin} Admin Panel
              </button>
            </div>
          )}
          <div className="sidebar-user">
            <img className="sidebar-avatar" src={user.photoURL || "https://ui-avatars.com/api/?name=User"} alt="avatar" />
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{userData?.name || user.displayName}</div>
              <div className="sidebar-user-role">{isAdmin ? "Administrator" : "Player"}</div>
            </div>
            <button className="signout-btn" onClick={handleSignOut} title="Sign out">{Icon.signout}</button>
          </div>
        </aside>

        {/* Main */}
        <div className="main">
          {/* Topbar */}
          <div className="topbar">
            <div className="topbar-left">
              <div className="topbar-logo-mobile" onClick={() => setPage("home")}>R</div>
              <span className="topbar-title">
                {page === "home" && "Dashboard"}
                {page === "funds" && "Funds"}
                {page === "tournaments" && "Tournaments"}
                {page === "profile" && "Profile"}
                {page === "admin" && "Admin Panel"}
              </span>
            </div>
            <div className="topbar-right">
              <div className="balance-chip">৳{fmt(userData?.balance)}</div>
              <img className="topbar-avatar" src={user.photoURL || "https://ui-avatars.com/api/?name=User"} alt="avatar" onClick={() => setPage("profile")} />
            </div>
          </div>

          {/* Pages */}
          {page === "home" && <HomePage user={user} userData={userData} setPage={setPage} showToast={showToast} />}
          {page === "funds" && <FundsPage user={user} userData={userData} showToast={showToast} />}
          {page === "tournaments" && <TournamentsPage user={user} userData={userData} showToast={showToast} />}
          {page === "profile" && <ProfilePage user={user} userData={userData} />}
          {page === "admin" && isAdmin && <AdminPanel showToast={showToast} />}
        </div>

        {/* Bottom Nav */}
        <nav className="bottom-nav">
          {navItems.map((n) => (
            <button key={n.id} className={`bnav-btn ${n.isAdmin ? "admin-nav" : ""} ${page === n.id ? "active" : ""}`} onClick={() => setPage(n.id)}>
              {n.icon} {n.label}
            </button>
          ))}
        </nav>
      </div>

      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────
function HomePage({ user, userData, setPage, showToast }) {
  const [transactions, setTransactions] = useState([]);
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    // User transactions
    const txRef = ref(db, `transactions/${user.uid}`);
    const unsub1 = onValue(txRef, (snap) => {
      const d = snap.val() || {};
      const arr = Object.entries(d).map(([k, v]) => ({ id: k, ...v })).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)).slice(0, 5);
      setTransactions(arr);
    });
    // Tournaments
    const tRef = ref(db, "tournaments");
    const unsub2 = onValue(tRef, (snap) => {
      const d = snap.val() || {};
      const arr = Object.entries(d).map(([k, v]) => ({ id: k, ...v })).filter(t => t.status === "open").slice(0, 3);
      setTournaments(arr);
    });
    return () => { unsub1(); unsub2(); };
  }, [user.uid]);

  const txTypeLabel = (t) => {
    if (t === "deposit") return "Deposit via bKash";
    if (t === "withdraw") return "Withdrawal to bKash";
    if (t === "win") return "Tournament Prize";
    if (t === "join") return "Tournament Entry Fee";
    if (t === "admin_credit") return "Admin Credit";
    if (t === "admin_debit") return "Admin Debit";
    return t;
  };

  return (
    <div className="page fade-in">
      <div className="page-title">Good day, {userData?.name?.split(" ")[0]} 👋</div>
      <div className="page-subtitle">Here's your account overview</div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#fef3c7" }}>💰</div>
          <div className="stat-value">৳{fmt(userData?.balance)}</div>
          <div className="stat-label">Current Balance</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#d1fae5" }}>🏆</div>
          <div className="stat-value">{userData?.wins || 0}</div>
          <div className="stat-label">Tournament Wins</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#dbeafe" }}>🎮</div>
          <div className="stat-value">{userData?.totalMatches || 0}</div>
          <div className="stat-label">Matches Played</div>
        </div>
      </div>

      {tournaments.length > 0 && (
        <>
          <div className="section-title">Open Tournaments</div>
          <div className="tournaments-grid">
            {tournaments.map((t) => (
              <TournamentCard key={t.id} tournament={t} user={user} userData={userData} showToast={showToast} compact />
            ))}
          </div>
        </>
      )}

      <div className="section-title">Recent Transactions</div>
      {transactions.length === 0 ? (
        <div className="empty"><div className="empty-icon">📭</div><div className="empty-title">No transactions yet</div><div className="empty-desc">Add funds to get started</div></div>
      ) : (
        <div className="tx-list">
          {transactions.map((tx) => (
            <div className="tx-item" key={tx.id}>
              <div className="tx-icon" style={{ background: tx.amount > 0 ? "#d1fae5" : "#fee2e2" }}>
                {tx.amount > 0 ? "↑" : "↓"}
              </div>
              <div className="tx-info">
                <div className="tx-name">{txTypeLabel(tx.type)}</div>
                <div className="tx-meta">{fmtDate(tx.createdAt)} • <span className={`badge badge-${tx.status === "completed" ? "success" : tx.status === "pending" ? "warning" : "danger"}`}>{tx.status}</span></div>
                {tx.transactionId && <div className="tx-meta">TxID: <span style={{ fontFamily: "JetBrains Mono", fontSize: 11 }}>{tx.transactionId}</span></div>}
              </div>
              <div className={`tx-amount ${tx.amount > 0 ? "positive" : "negative"}`}>
                {tx.amount > 0 ? "+" : ""}৳{fmt(Math.abs(tx.amount))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Funds Page ───────────────────────────────────────────────────────────────
function FundsPage({ user, userData, showToast }) {
  const [tab, setTab] = useState("deposit");
  const [depositAmt, setDepositAmt] = useState("");
  const [depositTxId, setDepositTxId] = useState("");
  const [withdrawAmt, setWithdrawAmt] = useState("");
  const [bkashNum, setBkashNum] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDepositRequest = async () => {
    const amt = parseInt(depositAmt);
    if (!amt || amt < 50) return showToast("Minimum deposit is ৳50", "error");
    if (!depositTxId.trim()) return showToast("Transaction ID is required", "error");
    setLoading(true);
    try {
      const txRef = push(ref(db, `transactions/${user.uid}`));
      await set(txRef, {
        type: "deposit",
        amount: amt,
        transactionId: depositTxId.trim(),
        status: "pending",
        createdAt: Date.now(),
        uid: user.uid,
        userName: userData?.name,
      });
      // Also add to deposit requests for admin
      const reqRef = push(ref(db, "depositRequests"));
      await set(reqRef, {
        txKey: txRef.key,
        uid: user.uid,
        userName: userData?.name,
        amount: amt,
        transactionId: depositTxId.trim(),
        status: "pending",
        createdAt: Date.now(),
      });
      showToast("Deposit request submitted! Admin will review shortly.", "success");
      setDepositAmt(""); setDepositTxId("");
    } catch (e) {
      showToast("Error submitting request", "error");
    }
    setLoading(false);
  };

  const handleWithdraw = async () => {
    const amt = parseInt(withdrawAmt);
    if (!amt || amt < 50) return showToast("Minimum withdrawal is ৳50", "error");
    if (amt > (userData?.balance || 0)) return showToast("Insufficient balance!", "error");
    if (!bkashNum || bkashNum.length < 11 || !bkashNum.startsWith("01")) return showToast("Enter valid bKash number", "error");
    setLoading(true);
    try {
      // Deduct balance and add tx
      await update(ref(db, `users/${user.uid}`), { balance: (userData.balance || 0) - amt });
      const txRef = push(ref(db, `transactions/${user.uid}`));
      await set(txRef, {
        type: "withdraw",
        amount: -amt,
        bkashNumber: bkashNum,
        status: "pending",
        createdAt: Date.now(),
        uid: user.uid,
        userName: userData?.name,
      });
      // Withdraw request for admin
      const wRef = push(ref(db, "withdrawRequests"));
      await set(wRef, {
        txKey: txRef.key,
        uid: user.uid,
        userName: userData?.name,
        amount: amt,
        bkashNumber: bkashNum,
        status: "pending",
        createdAt: Date.now(),
      });
      showToast(`Withdrawal of ৳${amt} to ${bkashNum} is pending!`, "success");
      setWithdrawAmt(""); setBkashNum("");
    } catch (e) {
      showToast("Error processing withdrawal", "error");
    }
    setLoading(false);
  };

  return (
    <div className="page fade-in">
      <div className="page-title">Manage Funds</div>
      <div className="page-subtitle">Deposit or withdraw via bKash</div>

      <div className="admin-tabs" style={{ maxWidth: 400 }}>
        <button className={`admin-tab ${tab === "deposit" ? "active" : ""}`} onClick={() => setTab("deposit")}>Deposit</button>
        <button className={`admin-tab ${tab === "withdraw" ? "active" : ""}`} onClick={() => setTab("withdraw")}>Withdraw</button>
      </div>

      {tab === "deposit" && (
        <div className="card" style={{ maxWidth: 480 }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Deposit via bKash</div>
          <div style={{ color: "var(--text-sec)", fontSize: 13, marginBottom: 20 }}>Send money to bKash: <strong>01711-234567</strong> then fill the form below</div>
          <div className="form-group">
            <label className="label">Amount (BDT)</label>
            <input className="input" type="number" placeholder="Minimum ৳50" value={depositAmt} onChange={e => setDepositAmt(e.target.value)} min="50" />
          </div>
          <div className="form-group">
            <label className="label">bKash Transaction ID</label>
            <input className="input" type="text" placeholder="e.g. 8AB12345CD" value={depositTxId} onChange={e => setDepositTxId(e.target.value)} />
            <div className="help-text">The TrxID you received after sending money to our bKash number</div>
          </div>
          <button className="btn btn-primary btn-full" onClick={handleDepositRequest} disabled={loading}>
            {loading ? "Submitting..." : "Submit Deposit Request"}
          </button>
          <div className="help-text" style={{ textAlign: "center", marginTop: 12 }}>Your balance will be updated after admin approval</div>
        </div>
      )}

      {tab === "withdraw" && (
        <div className="card" style={{ maxWidth: 480 }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Withdraw to bKash</div>
          <div style={{ color: "var(--text-sec)", fontSize: 13, marginBottom: 4 }}>Available Balance: <strong style={{ color: "var(--success)" }}>৳{fmt(userData?.balance)}</strong></div>
          <div style={{ color: "var(--text-sec)", fontSize: 13, marginBottom: 20 }}>Withdrawals are processed within 24 hours</div>
          <div className="form-group">
            <label className="label">Amount (BDT)</label>
            <input className="input" type="number" placeholder="Minimum ৳50" value={withdrawAmt} onChange={e => setWithdrawAmt(e.target.value)} min="50" />
          </div>
          <div className="form-group">
            <label className="label">Your bKash Number</label>
            <input className="input" type="tel" placeholder="01XXXXXXXXX" value={bkashNum} onChange={e => setBkashNum(e.target.value)} maxLength="11" />
          </div>
          <button className="btn btn-dark btn-full" onClick={handleWithdraw} disabled={loading}>
            {loading ? "Processing..." : "Request Withdrawal"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Tournament Card ──────────────────────────────────────────────────────────
function TournamentCard({ tournament: t, user, userData, showToast, compact }) {
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    if (t.participants?.[user.uid]) setJoined(true);
  }, [t, user.uid]);

  const handleJoin = async () => {
    if (joined) return showToast("Already joined this tournament!", "error");
    if ((userData?.balance || 0) < t.entryFee) return showToast(`Insufficient balance. Need ৳${t.entryFee}`, "error");
    setJoining(true);
    try {
      const newBal = (userData.balance || 0) - t.entryFee;
      await update(ref(db, `users/${user.uid}`), { balance: newBal, totalMatches: (userData.totalMatches || 0) + 1 });
      await update(ref(db, `tournaments/${t.id}/participants/${user.uid}`), { name: userData.name, uid: user.uid, joinedAt: Date.now() });
      const txRef = push(ref(db, `transactions/${user.uid}`));
      await set(txRef, { type: "join", amount: -t.entryFee, tournamentId: t.id, tournamentName: t.name, status: "completed", createdAt: Date.now() });
      await update(ref(db, `tournaments/${t.id}`), { currentPlayers: (t.currentPlayers || 0) + 1 });
      setJoined(true);
      showToast(`Joined "${t.name}"! Check room details before match.`, "success");
    } catch (e) {
      showToast("Error joining tournament", "error");
    }
    setJoining(false);
  };

  const spots = t.maxPlayers - (t.currentPlayers || 0);
  const startTime = t.startTime ? new Date(t.startTime) : null;
  const minutesLeft = startTime ? Math.max(0, Math.floor((startTime - Date.now()) / 60000)) : null;

  return (
    <div className="tournament-card">
      <div className="tc-header">
        <div>
          <div className="tc-title">{t.name}</div>
          <div className="tc-map">{t.map} • {t.mode}</div>
        </div>
        <span className={`badge badge-${t.status === "open" ? "success" : t.status === "live" ? "danger" : "info"}`}>
          {t.status === "live" ? <><div className="live-dot" />&nbsp;LIVE</> : t.status}
        </span>
      </div>
      <div className="tc-stats">
        <div className="tc-stat">
          <div className="tc-stat-val">৳{fmt(t.entryFee)}</div>
          <div className="tc-stat-label">Entry Fee</div>
        </div>
        <div className="tc-stat">
          <div className="tc-stat-val">৳{fmt(t.prizePool)}</div>
          <div className="tc-stat-label">Prize Pool</div>
        </div>
        <div className="tc-stat">
          <div className="tc-stat-val">{t.currentPlayers || 0}/{t.maxPlayers}</div>
          <div className="tc-stat-label">Players</div>
        </div>
        <div className="tc-stat">
          <div className="tc-stat-val">{t.teamSize || "1v1"}</div>
          <div className="tc-stat-label">Format</div>
        </div>
      </div>
      {t.roomId && joined && (
        <div style={{ background: "var(--accent-light)", border: "1px solid #fcd34d", borderRadius: 8, padding: "10px 14px", marginBottom: 12, fontSize: 13 }}>
          <strong>Room ID:</strong> {t.roomId} &nbsp; <strong>Pass:</strong> {t.roomPass || "—"}
        </div>
      )}
      <div className="tc-footer">
        <div className="tc-time">
          {minutesLeft !== null ? (minutesLeft <= 0 ? <span className="tc-time-live"><div className="live-dot"/>Starting soon</span> : `⏱ ${minutesLeft}m left`) : "—"}
        </div>
        {t.status === "open" && (
          <button className={`btn btn-sm ${joined ? "btn-outline" : "btn-primary"}`} onClick={handleJoin} disabled={joining || joined || spots <= 0}>
            {joining ? "..." : joined ? "✓ Joined" : spots <= 0 ? "Full" : `Join ৳${t.entryFee}`}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Tournaments Page ─────────────────────────────────────────────────────────
function TournamentsPage({ user, userData, showToast }) {
  const [tournaments, setTournaments] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const tRef = ref(db, "tournaments");
    return onValue(tRef, (snap) => {
      const d = snap.val() || {};
      setTournaments(Object.entries(d).map(([k, v]) => ({ id: k, ...v })).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));
    });
  }, []);

  const filtered = filter === "all" ? tournaments : tournaments.filter(t => t.status === filter);

  return (
    <div className="page fade-in">
      <div className="page-title">Tournaments</div>
      <div className="page-subtitle">Join and compete to win prize money</div>
      <div className="admin-tabs">
        {["all", "open", "live", "ended"].map(f => (
          <button key={f} className={`admin-tab ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="empty"><div className="empty-icon">🏆</div><div className="empty-title">No tournaments {filter !== "all" ? `with status "${filter}"` : "yet"}</div><div className="empty-desc">Check back soon or ask admin to create one</div></div>
      ) : (
        <div className="tournaments-grid">
          {filtered.map(t => <TournamentCard key={t.id} tournament={t} user={user} userData={userData} showToast={showToast} />)}
        </div>
      )}
    </div>
  );
}

// ─── Profile Page ─────────────────────────────────────────────────────────────
function ProfilePage({ user, userData }) {
  return (
    <div className="page fade-in">
      <div className="page-title">My Profile</div>
      <div className="page-subtitle">Your account details</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <img src={user.photoURL || "https://ui-avatars.com/api/?name=User&size=80"} alt="avatar" style={{ width: 64, height: 64, borderRadius: "50%", border: "3px solid var(--border)" }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 18 }}>{userData?.name || user.displayName}</div>
              <div style={{ color: "var(--text-sec)", fontSize: 13 }}>{user.email}</div>
              <span className={`badge badge-${userData?.role === "admin" ? "purple" : "info"}`} style={{ marginTop: 6 }}>{userData?.role || "user"}</span>
            </div>
          </div>
          <div className="divider" />
          {[
            ["Region", "Bangladesh 🇧🇩"],
            ["UID", <span className="uid-mono">{user.uid}</span>],
            ["Joined", fmtDate(userData?.joinedAt)],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px dashed var(--border)", fontSize: 14 }}>
              <span style={{ color: "var(--text-sec)" }}>{k}</span>
              <span style={{ fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>
        <div className="card">
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Game Stats</div>
          {[
            ["Balance", `৳${fmt(userData?.balance)}`],
            ["Total Matches", userData?.totalMatches || 0],
            ["Tournament Wins", userData?.wins || 0],
            ["Win Rate", userData?.totalMatches ? `${Math.round(((userData?.wins || 0) / userData?.totalMatches) * 100)}%` : "—"],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px dashed var(--border)", fontSize: 14 }}>
              <span style={{ color: "var(--text-sec)" }}>{k}</span>
              <span style={{ fontWeight: 700, fontFamily: "JetBrains Mono, monospace" }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Admin Panel ──────────────────────────────────────────────────────────────
function AdminPanel({ showToast }) {
  const [tab, setTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [depositReqs, setDepositReqs] = useState([]);
  const [withdrawReqs, setWithdrawReqs] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalBalance: 0, pendingDeposits: 0, pendingWithdraws: 0 });

  useEffect(() => {
    const u1 = onValue(ref(db, "users"), (snap) => {
      const d = snap.val() || {};
      const arr = Object.entries(d).map(([k, v]) => ({ uid: k, ...v }));
      setUsers(arr);
      setStats(s => ({ ...s, totalUsers: arr.length, totalBalance: arr.reduce((a, u) => a + (u.balance || 0), 0) }));
    });
    const u2 = onValue(ref(db, "tournaments"), (snap) => {
      const d = snap.val() || {};
      setTournaments(Object.entries(d).map(([k, v]) => ({ id: k, ...v })).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));
    });
    const u3 = onValue(ref(db, "depositRequests"), (snap) => {
      const d = snap.val() || {};
      const arr = Object.entries(d).map(([k, v]) => ({ id: k, ...v })).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setDepositReqs(arr);
      setStats(s => ({ ...s, pendingDeposits: arr.filter(r => r.status === "pending").length }));
    });
    const u4 = onValue(ref(db, "withdrawRequests"), (snap) => {
      const d = snap.val() || {};
      const arr = Object.entries(d).map(([k, v]) => ({ id: k, ...v })).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setWithdrawReqs(arr);
      setStats(s => ({ ...s, pendingWithdraws: arr.filter(r => r.status === "pending").length }));
    });
    return () => { u1(); u2(); u3(); u4(); };
  }, []);

  return (
    <div className="page fade-in">
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
        <div style={{ width: 36, height: 36, background: "var(--purple-light)", borderRadius: 10, display: "grid", placeItems: "center", color: "var(--purple)" }}>{Icon.admin}</div>
        <div className="page-title" style={{ margin: 0 }}>Admin Panel</div>
      </div>
      <div className="page-subtitle">Manage users, tournaments, deposits & withdrawals</div>

      <div className="admin-tabs">
        {[["overview","📊 Overview"],["deposits","💳 Deposits"],["withdrawals","💸 Withdrawals"],["users","👥 Users"],["tournaments","🏆 Tournaments"],["add-funds","➕ Add Funds"]].map(([id, label]) => (
          <button key={id} className={`admin-tab ${tab === id ? "active" : ""}`} onClick={() => setTab(id)}>{label}
            {id === "deposits" && stats.pendingDeposits > 0 && <span style={{ background: "var(--accent)", color: "white", borderRadius: "50%", width: 18, height: 18, fontSize: 10, display: "inline-grid", placeItems: "center", marginLeft: 6 }}>{stats.pendingDeposits}</span>}
            {id === "withdrawals" && stats.pendingWithdraws > 0 && <span style={{ background: "var(--danger)", color: "white", borderRadius: "50%", width: 18, height: 18, fontSize: 10, display: "inline-grid", placeItems: "center", marginLeft: 6 }}>{stats.pendingWithdraws}</span>}
          </button>
        ))}
      </div>

      {tab === "overview" && <AdminOverview stats={stats} users={users} tournaments={tournaments} depositReqs={depositReqs} withdrawReqs={withdrawReqs} />}
      {tab === "deposits" && <AdminDeposits depositReqs={depositReqs} showToast={showToast} />}
      {tab === "withdrawals" && <AdminWithdrawals withdrawReqs={withdrawReqs} showToast={showToast} />}
      {tab === "users" && <AdminUsers users={users} showToast={showToast} />}
      {tab === "tournaments" && <AdminTournaments tournaments={tournaments} showToast={showToast} />}
      {tab === "add-funds" && <AdminAddFunds users={users} showToast={showToast} />}
    </div>
  );
}

function AdminOverview({ stats, users, tournaments, depositReqs, withdrawReqs }) {
  return (
    <div>
      <div className="stats-grid">
        {[
          { icon: "👥", val: stats.totalUsers, label: "Total Users", color: "#dbeafe" },
          { icon: "💰", val: `৳${fmt(stats.totalBalance)}`, label: "Total Balance", color: "#d1fae5" },
          { icon: "⏳", val: stats.pendingDeposits, label: "Pending Deposits", color: "#fef3c7" },
          { icon: "📤", val: stats.pendingWithdraws, label: "Pending Withdrawals", color: "#fee2e2" },
          { icon: "🏆", val: tournaments.length, label: "Tournaments", color: "#ede9fe" },
        ].map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-icon" style={{ background: s.color }}>{s.icon}</div>
            <div className="stat-value" style={{ fontSize: 22 }}>{s.val}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 28 }}>
        <div>
          <div className="section-title" style={{ margin: "0 0 12px" }}>Recent Deposit Requests</div>
          <div className="tx-list">
            {depositReqs.filter(r => r.status === "pending").slice(0, 4).length === 0
              ? <div className="empty" style={{ padding: 24 }}><div>No pending deposits</div></div>
              : depositReqs.filter(r => r.status === "pending").slice(0, 4).map(r => (
                <div className="tx-item" key={r.id}>
                  <div className="tx-info">
                    <div className="tx-name">{r.userName}</div>
                    <div className="tx-meta">TxID: {r.transactionId}</div>
                  </div>
                  <div className="tx-amount positive">+৳{fmt(r.amount)}</div>
                </div>
              ))}
          </div>
        </div>
        <div>
          <div className="section-title" style={{ margin: "0 0 12px" }}>Recent Withdraw Requests</div>
          <div className="tx-list">
            {withdrawReqs.filter(r => r.status === "pending").slice(0, 4).length === 0
              ? <div className="empty" style={{ padding: 24 }}><div>No pending withdrawals</div></div>
              : withdrawReqs.filter(r => r.status === "pending").slice(0, 4).map(r => (
                <div className="tx-item" key={r.id}>
                  <div className="tx-info">
                    <div className="tx-name">{r.userName}</div>
                    <div className="tx-meta">{r.bkashNumber}</div>
                  </div>
                  <div className="tx-amount negative">-৳{fmt(r.amount)}</div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminDeposits({ depositReqs, showToast }) {
  const [filter, setFilter] = useState("pending");

  const handleApprove = async (req) => {
    try {
      // Credit user balance
      const userSnap = await get(ref(db, `users/${req.uid}`));
      const cur = userSnap.val()?.balance || 0;
      await update(ref(db, `users/${req.uid}`), { balance: cur + req.amount });
      // Update transaction status
      await update(ref(db, `transactions/${req.uid}/${req.txKey}`), { status: "completed" });
      // Update request status
      await update(ref(db, `depositRequests/${req.id}`), { status: "approved", resolvedAt: Date.now() });
      showToast(`Approved ৳${req.amount} deposit for ${req.userName}`, "success");
    } catch (e) {
      showToast("Error approving deposit", "error");
    }
  };

  const handleReject = async (req) => {
    try {
      await update(ref(db, `transactions/${req.uid}/${req.txKey}`), { status: "rejected" });
      await update(ref(db, `depositRequests/${req.id}`), { status: "rejected", resolvedAt: Date.now() });
      showToast(`Rejected deposit for ${req.userName}`, "error");
    } catch (e) {
      showToast("Error rejecting deposit", "error");
    }
  };

  const filtered = depositReqs.filter(r => filter === "all" || r.status === filter);

  return (
    <div>
      <div className="admin-tabs" style={{ maxWidth: 400 }}>
        {["pending", "approved", "rejected", "all"].map(f => (
          <button key={f} className={`admin-tab ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="empty"><div className="empty-icon">✅</div><div className="empty-title">No {filter} deposit requests</div></div>
      ) : filtered.map(req => (
        <div className="wr-item" key={req.id}>
          <div className="wr-info">
            <div className="wr-name">{req.userName}</div>
            <div className="wr-meta">
              TxID: <span style={{ fontFamily: "JetBrains Mono", fontSize: 12 }}>{req.transactionId}</span>
              &nbsp;•&nbsp;UID: <span style={{ fontFamily: "JetBrains Mono", fontSize: 11 }}>{req.uid?.slice(0, 10)}…</span>
            </div>
            <div className="wr-meta">{fmtDate(req.createdAt)}</div>
          </div>
          <div className="wr-amount" style={{ color: "var(--success)" }}>+৳{fmt(req.amount)}</div>
          <div className="wr-actions">
            <span className={`badge badge-${req.status === "approved" ? "success" : req.status === "rejected" ? "danger" : "warning"}`}>{req.status}</span>
            {req.status === "pending" && (
              <>
                <button className="btn btn-sm btn-success" onClick={() => handleApprove(req)}>{Icon.check} Approve</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleReject(req)}>{Icon.x} Reject</button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function AdminWithdrawals({ withdrawReqs, showToast }) {
  const [filter, setFilter] = useState("pending");

  const handleComplete = async (req) => {
    try {
      await update(ref(db, `transactions/${req.uid}/${req.txKey}`), { status: "completed" });
      await update(ref(db, `withdrawRequests/${req.id}`), { status: "completed", resolvedAt: Date.now() });
      showToast(`Marked withdrawal as completed for ${req.userName}`, "success");
    } catch (e) {
      showToast("Error", "error");
    }
  };

  const handleReject = async (req) => {
    // Refund
    try {
      const userSnap = await get(ref(db, `users/${req.uid}`));
      const cur = userSnap.val()?.balance || 0;
      await update(ref(db, `users/${req.uid}`), { balance: cur + req.amount });
      await update(ref(db, `transactions/${req.uid}/${req.txKey}`), { status: "rejected" });
      await update(ref(db, `withdrawRequests/${req.id}`), { status: "rejected", resolvedAt: Date.now() });
      showToast(`Rejected & refunded ৳${req.amount} to ${req.userName}`, "success");
    } catch (e) {
      showToast("Error", "error");
    }
  };

  const filtered = withdrawReqs.filter(r => filter === "all" || r.status === filter);

  return (
    <div>
      <div className="admin-tabs" style={{ maxWidth: 460 }}>
        {["pending", "completed", "rejected", "all"].map(f => (
          <button key={f} className={`admin-tab ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="empty"><div className="empty-icon">✅</div><div className="empty-title">No {filter} withdrawal requests</div></div>
      ) : filtered.map(req => (
        <div className="wr-item" key={req.id}>
          <div className="wr-info">
            <div className="wr-name">{req.userName}</div>
            <div className="wr-meta">bKash: <strong>{req.bkashNumber}</strong> • UID: <span style={{ fontFamily: "JetBrains Mono", fontSize: 11 }}>{req.uid?.slice(0, 10)}…</span></div>
            <div className="wr-meta">{fmtDate(req.createdAt)}</div>
          </div>
          <div className="wr-amount">-৳{fmt(req.amount)}</div>
          <div className="wr-actions">
            <span className={`badge badge-${req.status === "completed" ? "success" : req.status === "rejected" ? "danger" : "warning"}`}>{req.status}</span>
            {req.status === "pending" && (
              <>
                <button className="btn btn-sm btn-success" onClick={() => handleComplete(req)}>{Icon.check} Done</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleReject(req)}>{Icon.x} Refund</button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function AdminUsers({ users, showToast }) {
  const [editUser, setEditUser] = useState(null);
  const [newRole, setNewRole] = useState("user");
  const [search, setSearch] = useState("");

  const filtered = users.filter(u => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()) || u.uid?.includes(search));

  const handleRoleChange = async () => {
    try {
      await update(ref(db, `users/${editUser.uid}`), { role: newRole });
      showToast(`Role updated to ${newRole} for ${editUser.name}`, "success");
      setEditUser(null);
    } catch (e) {
      showToast("Error updating role", "error");
    }
  };

  const handleBan = async (u) => {
    try {
      await update(ref(db, `users/${u.uid}`), { banned: !u.banned });
      showToast(u.banned ? `Unbanned ${u.name}` : `Banned ${u.name}`, u.banned ? "success" : "error");
    } catch (e) {
      showToast("Error", "error");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <input className="input" style={{ maxWidth: 320 }} placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="table-wrap">
        <table className="admin-table">
          <thead><tr><th>User</th><th>UID</th><th>Balance</th><th>Role</th><th>Matches</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.uid}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <img src={u.photo || "https://ui-avatars.com/api/?name=" + encodeURIComponent(u.name || "U")} alt="" style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid var(--border)" }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{u.name} {u.banned && <span className="badge badge-danger">Banned</span>}</div>
                      <div style={{ color: "var(--text-sec)", fontSize: 11 }}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td><span className="uid-mono">{u.uid?.slice(0, 12)}…</span></td>
                <td><strong style={{ fontFamily: "JetBrains Mono" }}>৳{fmt(u.balance)}</strong></td>
                <td><span className={`badge badge-${u.role === "admin" ? "purple" : "info"}`}>{u.role || "user"}</span></td>
                <td>{u.totalMatches || 0}</td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn btn-sm btn-outline" onClick={() => { setEditUser(u); setNewRole(u.role || "user"); }}>{Icon.edit} Role</button>
                    <button className={`btn btn-sm ${u.banned ? "btn-success" : "btn-danger"}`} onClick={() => handleBan(u)}>
                      {u.banned ? "Unban" : "Ban"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editUser && (
        <div className="modal-overlay" onClick={() => setEditUser(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Change Role — {editUser.name}</div>
              <button className="modal-close" onClick={() => setEditUser(null)}>×</button>
            </div>
            <div className="form-group">
              <label className="label">Role</label>
              <select className="select" value={newRole} onChange={e => setNewRole(e.target.value)}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button className="btn btn-primary btn-full" onClick={handleRoleChange}>Save Changes</button>
              <button className="btn btn-outline" onClick={() => setEditUser(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminTournaments({ tournaments, showToast }) {
  const [showCreate, setShowCreate] = useState(false);
  const [editTournament, setEditTournament] = useState(null);
  const [form, setForm] = useState({
    name: "", map: "Bermuda", mode: "Lone Wolf", teamSize: "1v1",
    entryFee: 30, prizePool: 500, maxPlayers: 16,
    startTime: "", status: "open", roomId: "", roomPass: "",
  });

  const resetForm = () => setForm({ name: "", map: "Bermuda", mode: "Lone Wolf", teamSize: "1v1", entryFee: 30, prizePool: 500, maxPlayers: 16, startTime: "", status: "open", roomId: "", roomPass: "" });

  const openCreate = () => { resetForm(); setEditTournament(null); setShowCreate(true); };
  const openEdit = (t) => { setForm({ name: t.name || "", map: t.map || "Bermuda", mode: t.mode || "Lone Wolf", teamSize: t.teamSize || "1v1", entryFee: t.entryFee || 30, prizePool: t.prizePool || 500, maxPlayers: t.maxPlayers || 16, startTime: t.startTime ? new Date(t.startTime).toISOString().slice(0, 16) : "", status: t.status || "open", roomId: t.roomId || "", roomPass: t.roomPass || "" }); setEditTournament(t); setShowCreate(true); };

  const handleSave = async () => {
    if (!form.name.trim()) return showToast("Tournament name required", "error");
    try {
      const data = { ...form, entryFee: Number(form.entryFee), prizePool: Number(form.prizePool), maxPlayers: Number(form.maxPlayers), startTime: form.startTime ? new Date(form.startTime).getTime() : null, currentPlayers: editTournament?.currentPlayers || 0, createdAt: editTournament?.createdAt || Date.now() };
      if (editTournament) {
        await update(ref(db, `tournaments/${editTournament.id}`), data);
        showToast("Tournament updated!", "success");
      } else {
        await push(ref(db, "tournaments"), data);
        showToast("Tournament created!", "success");
      }
      setShowCreate(false); resetForm();
    } catch (e) {
      showToast("Error saving tournament", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this tournament?")) return;
    try {
      await set(ref(db, `tournaments/${id}`), null);
      showToast("Tournament deleted", "success");
    } catch (e) {
      showToast("Error deleting", "error");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await update(ref(db, `tournaments/${id}`), { status });
      showToast(`Status changed to ${status}`, "success");
    } catch (e) {
      showToast("Error", "error");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
        <button className="btn btn-primary" onClick={openCreate}>{Icon.plus} Create Tournament</button>
      </div>
      {tournaments.length === 0 ? (
        <div className="empty"><div className="empty-icon">🏆</div><div className="empty-title">No tournaments yet</div><div className="empty-desc">Create your first tournament</div></div>
      ) : (
        <div className="table-wrap">
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Map/Mode</th><th>Entry/Prize</th><th>Players</th><th>Start</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {tournaments.map(t => (
                <tr key={t.id}>
                  <td><strong>{t.name}</strong></td>
                  <td><div style={{ fontSize: 13 }}>{t.map}</div><div style={{ fontSize: 11, color: "var(--text-sec)" }}>{t.mode} • {t.teamSize}</div></td>
                  <td><div style={{ fontFamily: "JetBrains Mono", fontSize: 13 }}>৳{fmt(t.entryFee)} / ৳{fmt(t.prizePool)}</div></td>
                  <td>{t.currentPlayers || 0}/{t.maxPlayers}</td>
                  <td style={{ fontSize: 12 }}>{t.startTime ? fmtDate(t.startTime) : "—"}</td>
                  <td>
                    <select className="select" style={{ padding: "4px 8px", fontSize: 12, width: "auto" }} value={t.status} onChange={e => handleStatusChange(t.id, e.target.value)}>
                      {["open","live","ended","cancelled"].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-sm btn-outline" onClick={() => openEdit(t)}>{Icon.edit}</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(t.id)}>{Icon.trash}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" style={{ maxWidth: 560, maxHeight: "90vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{editTournament ? "Edit Tournament" : "Create Tournament"}</div>
              <button className="modal-close" onClick={() => setShowCreate(false)}>×</button>
            </div>
            <div className="form-group">
              <label className="label">Tournament Name</label>
              <input className="input" placeholder="e.g. Ryno Squad Clash" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="two-col">
              <div className="form-group">
                <label className="label">Map</label>
                <select className="select" value={form.map} onChange={e => setForm(f => ({ ...f, map: e.target.value }))}>
                  {["Bermuda","Kalahari","Purgatory","Alpine","Nexterra","Cs_Rank","Lone Wolf"].map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="label">Mode</label>
                <select className="select" value={form.mode} onChange={e => setForm(f => ({ ...f, mode: e.target.value }))}>
                  {["Lone Wolf","Duo","Squad","Clash Squad","Battle Royale"].map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
            </div>
            <div className="two-col">
              <div className="form-group">
                <label className="label">Team Size</label>
                <select className="select" value={form.teamSize} onChange={e => setForm(f => ({ ...f, teamSize: e.target.value }))}>
                  {["1v1","2v2","4v4","Solo","Duo","Squad"].map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="label">Max Players</label>
                <input className="input" type="number" value={form.maxPlayers} onChange={e => setForm(f => ({ ...f, maxPlayers: e.target.value }))} />
              </div>
            </div>
            <div className="two-col">
              <div className="form-group">
                <label className="label">Entry Fee (৳)</label>
                <input className="input" type="number" value={form.entryFee} onChange={e => setForm(f => ({ ...f, entryFee: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="label">Prize Pool (৳)</label>
                <input className="input" type="number" value={form.prizePool} onChange={e => setForm(f => ({ ...f, prizePool: e.target.value }))} />
              </div>
            </div>
            <div className="form-group">
              <label className="label">Start Time</label>
              <input className="input" type="datetime-local" value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} />
            </div>
            <div className="two-col">
              <div className="form-group">
                <label className="label">Room ID (optional)</label>
                <input className="input" placeholder="In-game room ID" value={form.roomId} onChange={e => setForm(f => ({ ...f, roomId: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="label">Room Password</label>
                <input className="input" placeholder="Password" value={form.roomPass} onChange={e => setForm(f => ({ ...f, roomPass: e.target.value }))} />
              </div>
            </div>
            <div className="form-group">
              <label className="label">Status</label>
              <select className="select" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                {["open","live","ended","cancelled"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button className="btn btn-primary btn-full" onClick={handleSave}>{editTournament ? "Save Changes" : "Create Tournament"}</button>
              <button className="btn btn-outline" onClick={() => setShowCreate(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminAddFunds({ users, showToast }) {
  const [selectedUid, setSelectedUid] = useState("");
  const [amount, setAmount] = useState("");
  const [txId, setTxId] = useState("");
  const [note, setNote] = useState("");
  const [type, setType] = useState("credit");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedUid) return showToast("Select a user", "error");
    const amt = parseInt(amount);
    if (!amt || amt <= 0) return showToast("Enter valid amount", "error");
    setLoading(true);
    try {
      const userSnap = await get(ref(db, `users/${selectedUid}`));
      const cur = userSnap.val()?.balance || 0;
      const newBal = type === "credit" ? cur + amt : Math.max(0, cur - amt);
      await update(ref(db, `users/${selectedUid}`), { balance: newBal });
      const txRef = push(ref(db, `transactions/${selectedUid}`));
      await set(txRef, {
        type: type === "credit" ? "admin_credit" : "admin_debit",
        amount: type === "credit" ? amt : -amt,
        transactionId: txId || null,
        note: note || null,
        status: "completed",
        createdAt: Date.now(),
        uid: selectedUid,
      });
      showToast(`${type === "credit" ? "Credited" : "Debited"} ৳${amt} ${type === "credit" ? "to" : "from"} ${userSnap.val()?.name}`, "success");
      setAmount(""); setTxId(""); setNote(""); setSelectedUid("");
    } catch (e) {
      showToast("Error processing", "error");
    }
    setLoading(false);
  };

  const selectedUser = users.find(u => u.uid === selectedUid);

  return (
    <div style={{ maxWidth: 520 }}>
      <div className="card">
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Manually Add / Deduct Funds</div>
        <div className="form-group">
          <label className="label">Select User</label>
          <select className="select" value={selectedUid} onChange={e => setSelectedUid(e.target.value)}>
            <option value="">— Choose a user —</option>
            {users.map(u => <option key={u.uid} value={u.uid}>{u.name} ({u.email})</option>)}
          </select>
        </div>
        {selectedUser && (
          <div style={{ background: "var(--bg)", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, display: "flex", justifyContent: "space-between" }}>
            <span>Current Balance:</span>
            <strong style={{ fontFamily: "JetBrains Mono" }}>৳{fmt(selectedUser.balance)}</strong>
          </div>
        )}
        <div className="form-group">
          <label className="label">Type</label>
          <div style={{ display: "flex", gap: 8 }}>
            <button className={`btn ${type === "credit" ? "btn-success" : "btn-outline"}`} style={{ flex: 1 }} onClick={() => setType("credit")}>➕ Credit</button>
            <button className={`btn ${type === "debit" ? "btn-danger" : "btn-outline"}`} style={{ flex: 1 }} onClick={() => setType("debit")}>➖ Debit</button>
          </div>
        </div>
        <div className="form-group">
          <label className="label">Amount (৳)</label>
          <input className="input" type="number" placeholder="Enter amount" value={amount} onChange={e => setAmount(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="label">Transaction ID (optional)</label>
          <input className="input" type="text" placeholder="bKash TrxID or reference" value={txId} onChange={e => setTxId(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="label">Note (optional)</label>
          <input className="input" type="text" placeholder="Internal note" value={note} onChange={e => setNote(e.target.value)} />
        </div>
        <button className={`btn btn-full ${type === "credit" ? "btn-success" : "btn-danger"}`} onClick={handleSubmit} disabled={loading}>
          {loading ? "Processing..." : `${type === "credit" ? "Credit" : "Debit"} Funds`}
        </button>
      </div>
    </div>
  );
}
