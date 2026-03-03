import { AlertTriangle, CircleX, RefreshCw, UsersRound, Workflow, Clock3 } from 'lucide-react';
import { SectionTitle, StatCard } from '../components/ui';

export function PayrollPage() {
  return (
    <div className="page page-payroll">
      <SectionTitle title="Payroll & Integrations" subtitle="Manage payroll system connections and employee data sync" action={<button className="primary-btn">+ Add Integration</button>} />
      <div className="grid cols-4">
        <StatCard title="Connected Systems" subtitle="Current integrations" value="3" delta="1 requires reconnect" icon={<Workflow size={16} />} />
        <StatCard title="Total Synced Employees" subtitle="Across all systems" value="2,685" delta="last full sync 2 mins" icon={<UsersRound size={16} />} />
        <StatCard title="Failed Syncs (24h)" subtitle="Needs attention" value="3" delta="API/auth failures" icon={<AlertTriangle size={16} />} />
        <StatCard title="Last Sync" subtitle="Most recent update" value="2 mins" delta="Realtime mode" icon={<Clock3 size={16} />} />
      </div>
      <section className="card panel">
        <h2>Connected Payroll Systems</h2>
        {[
          ['greytHR', 'Connected', '1,847 employees', 'Every 15 mins'],
          ['RazorpayX Payroll', 'Connected', '821 employees', 'Every 15 mins'],
          ['Zoho People', 'Connected', '17 employees', 'Hourly'],
          ['Keka', 'Error', '0 employees', 'Not syncing'],
        ].map((s) => (
          <article className={`integration ${s[1] === 'Error' ? 'integration-error' : ''}`} key={s[0]}>
            <div>
              <h4>{s[0]} <span className={`chip ${s[1] === 'Error' ? 'chip-warning' : 'chip-green'}`}>{s[1]}</span></h4>
              <small>{s[2]} • {s[3]}</small>
            </div>
            <div className="row-gap"><button className="ghost-btn"><RefreshCw size={14} /> Sync now</button><button className="link-btn"><CircleX size={14} /> Disconnect</button></div>
          </article>
        ))}
      </section>
      <section className="card panel">
        <h2>Available Integrations</h2>
        <div className="grid cols-3">
          {['BambooHR', 'Darwinbox', 'SAP SuccessFactors'].map((i) => (
            <article className="soft-card" key={i}><strong>{i}</strong><button className="ghost-btn">Connect</button></article>
          ))}
        </div>
      </section>
    </div>
  );
}
