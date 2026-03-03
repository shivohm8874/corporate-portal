import { useMemo, useState } from 'react';
import {
  Activity,
  BadgeIndianRupee,
  Bell,
  ChartColumnBig,
  ChartNoAxesColumnIncreasing,
  FileText,
  LayoutDashboard,
  Shield,
  Target,
  Users,
  WalletCards,
  Workflow,
  Wrench,
} from 'lucide-react';
import type { NavItem, PageKey } from './types/app';
import {
  AlertsPage,
  CommandCenterPage,
  CreditControlPage,
  ForecastingPage,
  HealthPage,
  PaymentsPage,
  PayrollPage,
  PoliciesPage,
  ProgramsPage,
  ReportsPage,
  SavingsPage,
  SettingsPage,
  WorkforcePage,
} from './pages';
import './styles/app-shell.css';
import './styles/auth.css';
import './styles/pages.css';

const navItems: NavItem[] = [
  { key: 'command', label: 'Command Center', icon: <LayoutDashboard size={16} /> },
  { key: 'credit', label: 'Credit Control', icon: <WalletCards size={16} /> },
  { key: 'payments', label: 'Payments', icon: <BadgeIndianRupee size={16} /> },
  { key: 'workforce', label: 'Workforce', icon: <Users size={16} /> },
  { key: 'payroll', label: 'Payroll', icon: <Workflow size={16} /> },
  { key: 'health', label: 'Health Intelligence', icon: <Activity size={16} /> },
  { key: 'programs', label: 'Programs', icon: <Target size={16} /> },
  { key: 'savings', label: 'Savings & ROI', icon: <ChartNoAxesColumnIncreasing size={16} /> },
  { key: 'forecasting', label: 'Forecasting', icon: <ChartColumnBig size={16} /> },
  { key: 'alerts', label: 'Alerts', icon: <Bell size={16} /> },
  { key: 'policies', label: 'Policies', icon: <Shield size={16} /> },
  { key: 'reports', label: 'Reports', icon: <FileText size={16} /> },
  { key: 'settings', label: 'Settings', icon: <Wrench size={16} /> },
];

const corporateDirectory: Record<string, { companyName: string; displayId: string }> = {
  HCL001: { companyName: 'HCLTech', displayId: 'HCL-001' },
  TCS101: { companyName: 'TCS', displayId: 'TCS-101' },
  INFY777: { companyName: 'Infosys', displayId: 'INFY-777' },
};

function getPageView(page: PageKey) {
  switch (page) {
    case 'command':
      return <CommandCenterPage />;
    case 'credit':
      return <CreditControlPage />;
    case 'payments':
      return <PaymentsPage />;
    case 'workforce':
      return <WorkforcePage />;
    case 'payroll':
      return <PayrollPage />;
    case 'health':
      return <HealthPage />;
    case 'programs':
      return <ProgramsPage />;
    case 'savings':
      return <SavingsPage />;
    case 'forecasting':
      return <ForecastingPage />;
    case 'alerts':
      return <AlertsPage />;
    case 'policies':
      return <PoliciesPage />;
    case 'reports':
      return <ReportsPage />;
    case 'settings':
      return <SettingsPage />;
    default:
      return null;
  }
}

function App() {
  const [current, setCurrent] = useState<PageKey>('command');
  const [authStep, setAuthStep] = useState<'corporate' | 'login' | 'ready'>('corporate');
  const [corporateIdInput, setCorporateIdInput] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [companyName, setCompanyName] = useState('HCLTech');
  const [companyDisplayId, setCompanyDisplayId] = useState('HCL-001');

  const authHint = useMemo(() => 'Demo Corporate IDs: HCL001, TCS101, INFY777', []);

  const authorizeCorporate = () => {
    const key = corporateIdInput.trim().toUpperCase();
    const matched = corporateDirectory[key];
    if (!matched) {
      setAuthError('Corporate ID not found. Please check and try again.');
      return;
    }

    setCompanyName(matched.companyName);
    setCompanyDisplayId(matched.displayId);
    setAuthError('');
    setAuthStep('login');
  };

  const loginUser = () => {
    if (!username.trim() || !password.trim()) {
      setAuthError('Enter username and password to continue.');
      return;
    }

    setAuthError('');
    setAuthStep('ready');
  };

  if (authStep !== 'ready') {
    return (
      <main className="login-wrap">
        <section className="login-shell fade-up">
          <article className="login-card">
            <h1>Employee Health Portal</h1>
            <p>Enterprise wellness intelligence platform for payroll-linked analytics and health credit operations.</p>

            {authStep === 'corporate' ? (
              <>
                <label>
                  Corporate ID
                  <input className="input" placeholder="Enter Corporate ID (e.g. HCL001)" value={corporateIdInput} onChange={(e) => setCorporateIdInput(e.target.value)} />
                </label>
                <button className="primary-btn" onClick={authorizeCorporate}>Authorize Corporate</button>
                <small>{authHint}</small>
              </>
            ) : (
              <>
                <div className="auth-company-block">
                  <strong>{companyName}</strong>
                  <span>Authorized Corporate ID: {companyDisplayId}</span>
                </div>
                <label>
                  Username
                  <input className="input" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </label>
                <label>
                  Password
                  <input className="input" type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
                <button className="primary-btn" onClick={loginUser}>Sign in</button>
                <button className="ghost-btn" onClick={() => setAuthStep('corporate')}>Back to Corporate ID</button>
              </>
            )}

            {authError && <p className="auth-error">{authError}</p>}
          </article>

          <article className="login-visual">
            <div className="orb orb-one" />
            <div className="orb orb-two" />
            <div className="orb orb-three" />
            <div className="glass-panel">
              <h3>Employee Health Portal</h3>
              <p>Corporate health intelligence with animated dashboards, trend graphs, pie analytics and payroll integration insights.</p>
              <div className="mini-slider">
                <div className="slide-track">
                  <div className="slide-item"><small>Wellness Score</small><strong>78%</strong></div>
                  <div className="slide-item"><small>Active Employees</small><strong>2,507</strong></div>
                  <div className="slide-item"><small>Projected Savings</small><strong>₹22.8L</strong></div>
                  <div className="slide-item"><small>Payroll Sync Health</small><strong>98.7%</strong></div>
                </div>
              </div>
            </div>
          </article>
        </section>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <h2>Employee Health Portal</h2>
          <p>{companyName} • Decision Intelligence</p>
        </div>

        <nav>
          {navItems.map((item) => (
            <button key={item.key} className={`nav-item ${current === item.key ? 'active' : ''}`} onClick={() => setCurrent(item.key)}>
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>

        <div className="quick-stats">
          <small>Quick Stats</small>
          <strong>2,847 Active Users</strong>
          <span>Sync: 2 mins ago</span>
          <button className="ghost-btn" onClick={() => setAuthStep('corporate')}>Switch Corporate</button>
        </div>
      </aside>

      <main className="content">{getPageView(current)}</main>
    </div>
  );
}

export default App;
