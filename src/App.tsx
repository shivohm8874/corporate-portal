import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Activity,
  Bell,
  ChartColumnBig,
  ChartNoAxesColumnIncreasing,
  Eye,
  EyeOff,
  FileText,
  LayoutDashboard,
  LogOut,
  Target,
  UserCircle,
  Users,
  WalletCards,
  Workflow,
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
  CorporateRegisterPage,
  CorporateTrackStatusPage,
} from './pages';
import './styles/app-shell.css';
import './styles/auth.css';
import './styles/pages.css';

const navItems: NavItem[] = [
  { key: 'command', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
  { key: 'workforce', label: 'Employees', icon: <Users size={16} /> },
  { key: 'health', label: 'Health Insights', icon: <Activity size={16} /> },
  { key: 'programs', label: 'Health Programmes', icon: <Target size={16} /> },
  { key: 'savings', label: 'Savings & ROI', icon: <ChartNoAxesColumnIncreasing size={16} /> },
  { key: 'forecasting', label: 'Trajectory Forecast', icon: <ChartColumnBig size={16} /> },
  { key: 'payroll', label: 'Payroll & Insurance', icon: <Workflow size={16} /> },
  { key: 'credit', label: 'Credits & Billing', icon: <WalletCards size={16} /> },
  { key: 'alerts', label: 'Alerts & Policies', icon: <Bell size={16} /> },
  { key: 'reports', label: 'Reports', icon: <FileText size={16} /> },
  { key: 'settings', label: 'Profile', icon: <UserCircle size={16} /> },
];

type HeroTile = {
  id: string;
  className: string;
  content: ReactNode;
};

function shuffleTiles(items: HeroTile[]) {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

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
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const DESKTOP_MIN_WIDTH = 1024;
  const [current, setCurrent] = useState<PageKey>('command');
  const [authStep, setAuthStep] = useState<'corporate' | 'login' | 'forgot' | 'reset' | 'ready'>('corporate');
  const [corporateIdInput, setCorporateIdInput] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
  const lastAuthorizedRef = useRef('');

  const baseHeroTiles: HeroTile[] = [
    {
      id: 'brand',
      className: 'hero-tile hero-brand',
      content: (
        <>
          <div className="brand-mark" />
          <div className="brand-copy">
            <span>Welcome back!</span>
            <strong>Access your health intelligence portal.</strong>
          </div>
        </>
      ),
    },
    {
      id: 'graph',
      className: 'hero-tile hero-graph',
      content: (
        <>
          <div className="hero-mini-card">
            <span>Engagement</span>
            <strong>84%</strong>
            <div className="hero-sparkline" />
          </div>
          <div className="hero-bar" />
          <div className="hero-bar short" />
          <div className="hero-line" />
          <span className="hero-callout">{companyDisplayId ? `Corporate ID ${companyDisplayId}` : 'Enter your 6 digit corporate ID'}</span>
        </>
      ),
    },
    {
      id: 'pattern',
      className: 'hero-tile hero-pattern',
      content: (
        <div className="hero-pattern-stack">
          <div className="pattern-kpi">
            <span>Claims processed</span>
            <strong>1,284</strong>
          </div>
          <div className="pattern-kpi">
            <span>Upcoming audits</span>
            <strong>3</strong>
          </div>
          <div className="pattern-pill">Coverage review in 12 days</div>
        </div>
      ),
    },
    {
      id: 'abstract',
      className: 'hero-tile hero-abstract',
      content: (
        <>
          <span className="abstract-circle" />
          <span className="abstract-wave" />
          <span className="abstract-star" />
          <div className="hero-stat-chip">
            <span>Wellness index</span>
            <strong>78</strong>
          </div>
          <div className="abstract-caption">Mood stability</div>
        </>
      ),
    },
    {
      id: 'metrics',
      className: 'hero-tile hero-metrics',
      content: (
        <>
          <div>
            <small>Engagement</small>
            <strong>84%</strong>
          </div>
          <div>
            <small>Savings</small>
            <strong>₹22.8L</strong>
          </div>
          <div className="hero-pill-row">
            <span>Payroll sync</span>
            <span className="pill">98.7%</span>
          </div>
          <div className="hero-kpi">
            <span>Active employees</span>
            <strong>2,198</strong>
          </div>
          <div className="hero-kpi">
            <span>At risk</span>
            <strong>288</strong>
          </div>
          <div className="hero-legend">
            <span className="legend-item"><span className="legend-dot" style={{ background: '#5eead4' }} />Green</span>
            <span className="legend-item"><span className="legend-dot" style={{ background: '#facc15' }} />Orange</span>
            <span className="legend-item"><span className="legend-dot" style={{ background: '#f87171' }} />Red</span>
          </div>
        </>
      ),
    },
    {
      id: 'gradient',
      className: 'hero-tile hero-gradient',
      content: (
        <div className="hero-table">
          <div className="hero-table-row">
            <span>Risk alerts</span>
            <strong>12</strong>
          </div>
          <div className="hero-table-row">
            <span>Programmes</span>
            <strong>8 live</strong>
          </div>
          <div className="hero-table-row">
            <span>Claims open</span>
            <strong>47</strong>
          </div>
        </div>
      ),
    },
  ];

  const [heroTiles, setHeroTiles] = useState<HeroTile[]>(baseHeroTiles);

  const CORPORATE_ID_KEY = 'corporate_id_session';

  useEffect(() => {
    const onResize = () => setDesktopAllowed(window.innerWidth >= DESKTOP_MIN_WIDTH);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    setHeroTiles(baseHeroTiles);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyDisplayId]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setHeroTiles((prev) => shuffleTiles(prev));
    }, 5200);
    return () => window.clearInterval(interval);
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

  useEffect(() => {
    if (authStep !== 'corporate' || authLoading) return;
    const trimmed = corporateIdInput.trim().toUpperCase();
    if (!trimmed) {
      setAuthError('');
      setAuthInfo('');
      return;
    }
    if (trimmed === lastAuthorizedRef.current) return;
    const timeoutId = window.setTimeout(() => {
      lastAuthorizedRef.current = trimmed;
      void authorizeCorporateStep(trimmed);
    }, 600);
    return () => window.clearTimeout(timeoutId);
  }, [authStep, corporateIdInput, authLoading]);

  const authorizeCorporateStep = async (id?: string) => {
    const key = (id ?? corporateIdInput).trim().toUpperCase();
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

  if (pathname.startsWith('/register')) {
    return <CorporateRegisterPage />;
  }

  if (pathname.startsWith('/track-status') || pathname.startsWith('/tract-status')) {
    return <CorporateTrackStatusPage />;
  }

  if (!desktopAllowed) {
    return (
      <main className="desktop-only-wrap">
        <section className="desktop-only-card">
          <h1>Astikan Health Programme</h1>
          <p>Please login through desktop for the best and secure experience.</p>
          <small>This portal is currently optimized for desktop screens only.</small>
        </section>
      </main>
    );
  }

  if (authStep !== 'ready') {
    return (
      <main className="login-wrap">
        <section className="login-shell fade-up">
          <article className="login-card">
            <div className="login-brand">
              <img className="brand-icon" src="/favicon.png" alt="Astikan" />
              <span className="brand-text">Astikan</span>
            </div>
            <p className="login-kicker">Welcome back!</p>
            <h1>Astikan Health Programme</h1>
            <p>Enterprise wellness intelligence platform for payroll-linked analytics.</p>

            {authStep === 'corporate' ? (
              <>
                <label>
                  Corporate ID <span className="required">*</span>
                  <input
                    className="input"
                    placeholder="Enter Your 6 Digit Corporate ID"
                    value={corporateIdInput}
                    onChange={(e) => setCorporateIdInput(e.target.value)}
                    required
                  />
                </label>
                {authLoading && <p className="auth-info">Verifying corporate ID...</p>}
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
                  <div className="auth-input-wrap">
                    <input
                      className="input"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="auth-eye-btn"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
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
                    placeholder="Enter Your 6 Digit Corporate ID"
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
            <div className="login-hero">
              <div className="hero-grid">
                {heroTiles.map((tile) => (
                  <div key={tile.id} className={tile.className}>
                    {tile.content}
                  </div>
                ))}
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
        <div className="sidebar-brand">
          <div className="brand-badge" aria-hidden="true">
            {companyName
              .split(' ')
              .filter(Boolean)
              .slice(0, 2)
              .map((word) => word[0])
              .join('')
              .toUpperCase() || 'CO'}
          </div>
          <div>
            <h2>{companyName}</h2>
            <p>{companyDisplayId ? `Corporate ID ${companyDisplayId}` : 'Astikan Health Programme'}</p>
          </div>
        </div>

        <nav>
          {navItems.map((item) => (
            <button key={item.key} className={`nav-item ${current === item.key ? 'active' : ''}`} onClick={() => setCurrent(item.key)}>
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            className="icon-btn"
            onClick={() => {
              clearCorporateSession();
              setAuthStep('corporate');
              setCorporateIdInput('');
              setUsername('');
              setPassword('');
              setAuthError('');
              setAuthInfo('');
            }}
            aria-label="Logout"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      <main className="content">{getPageView(current)}</main>
    </div>
  );
}

export default App;
