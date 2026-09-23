import React, { useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/generate', label: 'Generate Personas' },
  { to: '/personas', label: 'Persona Hub' },
  { to: '/validation', label: 'Product Validation' },
  { to: '/interview', label: 'Interview Mode' },
  { to: '/survey', label: 'Survey Mode' },
  { to: '/insights', label: 'Behavioural Insights' },
  { to: '/dashboard', label: 'Results & Report Dashboard' },
  { to: '/quality-lab', label: 'Scenario Quality Lab' },
];

export default function AppLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const pageTitle = useMemo(() => {
    const match = navItems.find((item) => item.to === location.pathname);
    return match?.label ?? 'Dashboard';
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <aside className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar__brand">
          <div>
            <p className="eyebrow">ProductPersona AI</p>
            <h2>User Research Studio</h2>
          </div>
        </div>

        <nav className="sidebar__nav">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="content-shell">
        <header className="topbar">
          <div className="topbar__left">
            <button className="icon-button mobile-only" onClick={() => setIsSidebarOpen((value) => !value)} aria-label="Toggle navigation">
              ☰
            </button>
            <div>
              <p className="eyebrow">{pageTitle}</p>
              <h1>{pageTitle}</h1>
            </div>
          </div>
        </header>

        <main className="content">
          {children}
        </main>
      </div>

      {isSidebarOpen ? <button className="overlay" onClick={() => setIsSidebarOpen(false)} aria-label="Close sidebar" /> : null}
    </div>
  );
}
