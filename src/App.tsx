import { useEffect, useState } from 'react';
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
import { authorizeCorporate, clearCorporateSession, getCorporateSession, loginCorporate, saveCorporateSession } from './services/authApi';
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
  { key: 'command', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
  { key: 'credit', label: 'Credits', icon: <WalletCards size={16} /> },
  { key: 'payments', label: 'Billing', icon: <BadgeIndianRupee size={16} /> },
  { key: 'workforce', label: 'Employees', icon: <Users size={16} /> },
  { key: 'payroll', label: 'Payroll Sync', icon: <Workflow size={16} /> },
  { key: 'health', label: 'Health Insights', icon: <Activity size={16} /> },
  { key: 'programs', label: 'Programs', icon: <Target size={16} /> },
  { key: 'savings', label: 'Savings', icon: <ChartNoAxesColumnIncreasing size={16} /> },
  { key: 'forecasting', label: 'Forecast', icon: <ChartColumnBig size={16} /> },
  { key: 'alerts', label: 'Alerts', icon: <Bell size={16} /> },
  { key: 'policies', label: 'Policies', icon: <Shield size={16} /> },
  { key: 'reports', label: 'Reports', icon: <FileText size={16} /> },
  { key: 'settings', label: 'Settings', icon: <Wrench size={16} /> },
];

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
  const DESKTOP_MIN_WIDTH = 1024;
  const [current, setCurrent] = useState<PageKey>('command');
  const [authStep, setAuthStep] = useState<'corporate' | 'login' | 'forgot' | 'reset' | 'ready'>('corporate');
  const [corporateIdInput, setCorporateIdInput] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authInfo, setAuthInfo] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetCorporateId, setResetCorporateId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [companyName, setCompanyName] = useState('Astikan');
  const [companyDisplayId, setCompanyDisplayId] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [desktopAllowed, setDesktopAllowed] = useState(typeof window !== 'undefined' ? window.innerWidth >= DESKTOP_MIN_WIDTH : true);

  const CORPORATE_ID_KEY = 'corporate_id_session';

  useEffect(() => {
    const onResize = () => setDesktopAllowed(window.innerWidth >= DESKTOP_MIN_WIDTH);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const session = getCorporateSession();
    if (!session) return;
    setCompanyName(session.companyName ?? 'Astikan');
    setCompanyDisplayId(session.corporateId);
    setAuthStep('ready');
  }, []);

  useEffect(() => {
    const savedId = sessionStorage.getItem(CORPORATE_ID_KEY);
    if (savedId) setCorporateIdInput(savedId);
  }, []);

  if (!desktopAllowed) {
    return (
      <main className="desktop-only-wrap">
        <section className="desktop-only-card">
          <h1>Astikan Corporate Intelligence</h1>
          <p>Please login through desktop for the best and secure experience.</p>
          <small>This portal is currently optimized for desktop screens only.</small>
        </section>
      </main>
    );
  }

  const authorizeCorporateStep = async () => {
    const key = corporateIdInput.trim().toUpperCase();
    if (!key) {
      setAuthError('');
      return;
    }

    setAuthLoading(true);
    try {
      const payload = await authorizeCorporate(key);
      setCompanyName(payload.companyName);
      setCompanyDisplayId(payload.corporateId);
      sessionStorage.setItem(CORPORATE_ID_KEY, payload.corporateId);
      setAuthError('');
      setAuthInfo('');
      setAuthStep('login');
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Corporate ID not found. Please check and try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const loginUser = async () => {
    if (!username.trim() || !password.trim()) {
      setAuthError('Enter username and password to continue.');
      return;
    }

    setAuthLoading(true);
    try {
      const payload = await loginCorporate(companyDisplayId, username, password);
      saveCorporateSession({ ...payload, corporateId: companyDisplayId });
      setAuthError('');
      setAuthInfo('');
      setAuthStep('ready');
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Unable to sign in.');
    } finally {
      setAuthLoading(false);
    }
  };

  if (authStep !== 'ready') {
    return (
      <main className="login-wrap">
        <section className="login-shell fade-up">
          <article className="login-card">
            <h1>Astikan Corporate Intelligence</h1>
            <p>Enterprise wellness intelligence platform for payroll-linked analytics and health credit operations.</p>

            {authStep === 'corporate' ? (
              <>
                <label>
                  Corporate ID <span className="required">*</span>
                  <input
                    className="input"
                    placeholder="Enter Corporate ID (e.g. HCL001)"
                    value={corporateIdInput}
                    onChange={(e) => setCorporateIdInput(e.target.value)}
                    required
                  />
                </label>
                <button className="primary-btn" onClick={() => void authorizeCorporateStep()} disabled={authLoading}>
                  {authLoading ? 'Authorizing...' : 'Authorize Corporate'}
                </button>
              </>
            ) : authStep === 'login' ? (
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
                <button
                  className="link-btn"
                  type="button"
                  onClick={() => {
                    setAuthError('');
                    setAuthInfo('');
                    setResetCorporateId(companyDisplayId);
                    setAuthStep('forgot');
                  }}
                >
                  Forgot password?
                </button>
                <button className="primary-btn" onClick={() => void loginUser()} disabled={authLoading}>
                  {authLoading ? 'Signing in...' : 'Sign in'}
                </button>
              </>
            ) : authStep === 'forgot' ? (
              <>
                <label>
                  Corporate Email
                  <input
                    className="input"
                    type="email"
                    placeholder="Enter corporate email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                  />
                </label>
                <label>
                  Corporate ID <span className="required">*</span>
                  <input
                    className="input"
                    placeholder="Enter Corporate ID"
                    value={resetCorporateId}
                    onChange={(e) => setResetCorporateId(e.target.value)}
                    required
                  />
                </label>
                <button
                  className="primary-btn"
                  type="button"
                  onClick={() => {
                    if (!resetCorporateId.trim() || !resetEmail.trim()) {
                      setAuthError('Please enter corporate email and ID.');
                      return;
                    }
                    setAuthError('');
                    setAuthInfo('Reset link sent. Please create a new password.');
                    setAuthStep('reset');
                  }}
                >
                  Send reset link
                </button>
              </>
            ) : (
              <>
                <div className="auth-company-block">
                  <strong>Password reset</strong>
                  <span>{resetCorporateId || companyDisplayId}</span>
                </div>
                <label>
                  New password
                  <input
                    className="input"
                    type="password"
                    placeholder="Create new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </label>
                <label>
                  Confirm password
                  <input
                    className="input"
                    type="password"
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </label>
                <button
                  className="primary-btn"
                  type="button"
                  onClick={() => {
                    if (!newPassword || newPassword.length < 6) {
                      setAuthError('Password must be at least 6 characters.');
                      return;
                    }
                    if (newPassword !== confirmPassword) {
                      setAuthError('Passwords do not match.');
                      return;
                    }
                    setAuthError('');
                    setAuthInfo('Password updated. Please sign in.');
                    setAuthStep('login');
                  }}
                >
                  Set new password
                </button>
              </>
            )}

            {authError && <p className="auth-error">{authError}</p>}
            {authInfo && <p className="auth-info">{authInfo}</p>}
          </article>

          <article className="login-visual">
            <div className="orb orb-one" />
            <div className="orb orb-two" />
            <div className="orb orb-three" />
            <div className="login-showcase">
              <div className="showcase-head">
                <h3>Corporate Decision Suite</h3>
                <p>Animated dashboards, payroll linkage, and outcome tracking in one flow.</p>
              </div>
              <div className="showcase-slider">
                <div className="showcase-track">
                  <div className="showcase-slide">
                    <div>
                      <small>Health Insights</small>
                      <strong>Live wellness signals</strong>
                      <span>Employee risk, engagement, and care adoption.</span>
                    </div>
                    <div className="showcase-illustration pulse-a" />
                  </div>
                  <div className="showcase-slide">
                    <div>
                      <small>Projected Savings</small>
                      <strong>INR 22.8L this quarter</strong>
                      <span>Claims avoided with OPD and tele support.</span>
                    </div>
                    <div className="showcase-illustration pulse-b" />
                  </div>
                  <div className="showcase-slide">
                    <div>
                      <small>Payroll + Credits</small>
                      <strong>98.7% sync health</strong>
                      <span>Auto-adjusted credit runway and payouts.</span>
                    </div>
                    <div className="showcase-illustration pulse-c" />
                  </div>
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
          <h2>Astikan Corporate Intelligence</h2>
          <p>{companyName} - Decision Intelligence</p>
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
          <button
            className="ghost-btn"
            onClick={() => {
              clearCorporateSession();
              setAuthStep('corporate');
              setCorporateIdInput('');
              setUsername('');
              setPassword('');
              setAuthError('');
              setAuthInfo('');
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="content">{getPageView(current)}</main>
    </div>
  );
}

export default App;
