import { useMemo, useState } from 'react';
import { AlertTriangle, CircleX, RefreshCw, UsersRound, Workflow, Clock3, Landmark } from 'lucide-react';
import { SectionTitle, StatCard } from '../components/ui';

type ConnectedIntegration = {
  name: string;
  status: 'Connected' | 'Error';
  employees: string;
  cadence: string;
};

const payrollConnectedSeed: ConnectedIntegration[] = [
  { name: 'greytHR', status: 'Connected', employees: '1,847 employees', cadence: 'Every 15 mins' },
  { name: 'RazorpayX Payroll', status: 'Connected', employees: '821 employees', cadence: 'Every 15 mins' },
  { name: 'Zoho People', status: 'Connected', employees: '17 employees', cadence: 'Hourly' },
  { name: 'Keka', status: 'Error', employees: '0 employees', cadence: 'Not syncing' },
];

const financeConnectedSeed: ConnectedIntegration[] = [
  { name: 'Tally ERP', status: 'Connected', employees: '2,612 mapped employees', cadence: 'Daily settlement sync' },
  { name: 'Zoho Books', status: 'Connected', employees: '2,685 mapped employees', cadence: 'Hourly invoice sync' },
  { name: 'SAP Business One', status: 'Error', employees: '0 mapped employees', cadence: 'Credential expired' },
];

const availablePayroll = ['BambooHR', 'Darwinbox', 'SAP SuccessFactors'];
const availableFinance = ['Oracle NetSuite', 'QuickBooks', 'Xero', 'Microsoft Dynamics 365 Finance'];

export function PayrollPage() {
  const [activity, setActivity] = useState('All integration channels healthy except Keka and SAP Business One.');
  const [connectedFinance, setConnectedFinance] = useState<string[]>([]);

  const connectedSystems = useMemo(
    () =>
      payrollConnectedSeed.filter((x) => x.status === 'Connected').length +
      financeConnectedSeed.filter((x) => x.status === 'Connected').length +
      connectedFinance.length,
    [connectedFinance]
  );

  const mappedEmployees = useMemo(() => {
    const base = 2685;
    const increment = connectedFinance.length * 240;
    return (base + increment).toLocaleString('en-IN');
  }, [connectedFinance.length]);

  function handleConnectFinance(name: string) {
    if (connectedFinance.includes(name)) return;
    setConnectedFinance((prev) => [...prev, name]);
    setActivity(`${name} connected successfully. Finance sync onboarding started.`);
  }

  function handleSync(name: string) {
    setActivity(`${name} sync queued. Fresh records will appear in reports within a few minutes.`);
  }

  function handleDisconnect(name: string) {
    setActivity(`${name} disconnect requested. Access token revocation in progress.`);
  }

  return (
    <div className="page page-payroll">
      <SectionTitle
        title="Payroll & Finance Integrations"
        subtitle="Connect payroll and finance-operation systems to sync employee mapping, billing and ROI"
        action={<button className="primary-btn">+ Add Integration</button>}
      />
      <div className="grid cols-4">
        <StatCard title="Connected Systems" subtitle="Current integrations" value={String(connectedSystems)} delta="2 require reconnect" icon={<Workflow size={16} />} />
        <StatCard title="Total Synced Employees" subtitle="Across all systems" value={mappedEmployees} delta="last full sync 2 mins" icon={<UsersRound size={16} />} />
        <StatCard title="Failed Syncs (24h)" subtitle="Needs attention" value="4" delta="API/auth failures" icon={<AlertTriangle size={16} />} />
        <StatCard title="Last Sync" subtitle="Most recent update" value="2 mins" delta="Realtime mode" icon={<Clock3 size={16} />} />
      </div>

      <p className="workforce-subline">{activity}</p>

      <section className="card panel">
        <h2>Connected Payroll Systems</h2>
        {payrollConnectedSeed.map((s) => (
          <article className={`integration ${s.status === 'Error' ? 'integration-error' : ''}`} key={s.name}>
            <div>
              <h4>{s.name} <span className={`chip ${s.status === 'Error' ? 'chip-warning' : 'chip-green'}`}>{s.status}</span></h4>
              <small>{s.employees} • {s.cadence}</small>
            </div>
            <div className="row-gap">
              <button className="ghost-btn" onClick={() => handleSync(s.name)}><RefreshCw size={14} /> Sync now</button>
              <button className="link-btn" onClick={() => handleDisconnect(s.name)}><CircleX size={14} /> Disconnect</button>
            </div>
          </article>
        ))}
      </section>

      <section className="card panel">
        <h2>Available Payroll Integrations</h2>
        <div className="grid cols-3">
          {availablePayroll.map((i) => (
            <article className="soft-card" key={i}><strong>{i}</strong><button className="ghost-btn">Connect</button></article>
          ))}
        </div>
      </section>

      <section className="card panel">
        <h2>Connected Finance Operations Systems</h2>
        {financeConnectedSeed.map((s) => (
          <article className={`integration ${s.status === 'Error' ? 'integration-error' : ''}`} key={s.name}>
            <div>
              <h4>{s.name} <span className={`chip ${s.status === 'Error' ? 'chip-warning' : 'chip-green'}`}>{s.status}</span></h4>
              <small>{s.employees} • {s.cadence}</small>
            </div>
            <div className="row-gap">
              <button className="ghost-btn" onClick={() => handleSync(s.name)}><RefreshCw size={14} /> Sync now</button>
              <button className="link-btn" onClick={() => handleDisconnect(s.name)}><CircleX size={14} /> Disconnect</button>
            </div>
          </article>
        ))}
      </section>

      <section className="card panel">
        <h2>Finance Operations Integrations</h2>
        <p className="muted">Connect systems carrying company financial operations like Tally ERP, accounting and reconciliation stacks.</p>
        <div className="grid cols-3">
          {availableFinance.map((name) => {
            const isConnected = connectedFinance.includes(name);
            return (
              <article className="soft-card" key={name}>
                <strong><Landmark size={14} /> {name}</strong>
                <button className="ghost-btn" onClick={() => handleConnectFinance(name)} disabled={isConnected}>
                  {isConnected ? 'Connected' : 'Connect'}
                </button>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
