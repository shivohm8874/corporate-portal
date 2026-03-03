import { Activity, CircleX, RefreshCw, Users } from 'lucide-react';
import { ProgressBar, SectionTitle, StatCard } from '../components/ui';

export function WorkforcePage() {
  return (
    <div className="page page-workforce">
      <SectionTitle title="Employee Overview" subtitle="Understand employee participation by team" />
      <div className="grid cols-4">
        <StatCard title="Total Employees" subtitle="Company strength" value="2,685" delta="Updated 2 mins ago" icon={<Users size={16} />} />
        <StatCard title="Active" subtitle="Using health services" value="2,507" delta="93.4% active" icon={<Activity size={16} />} />
        <StatCard title="Inactive" subtitle="No activity in 30 days" value="178" delta="Needs intervention" icon={<CircleX size={16} />} />
        <StatCard title="Active Rate" subtitle="Total utilization" value="93.4%" delta="+1.8% this month" icon={<RefreshCw size={16} />} />
      </div>
      <section className="card panel">
        <h2>Department Heatmap</h2>
        <div className="grid cols-4">
          {[
            ['Engineering', 842, 94.8], ['Sales', 324, 92.9], ['Marketing', 156, 94.9], ['Operations', 512, 91.4],
            ['Finance', 128, 95.3], ['HR', 64, 96.9], ['Customer Support', 421, 91.2], ['Product', 238, 94.1],
          ].map((d) => (
            <article className="dept-card" key={d[0]}>
              <h4>{d[0]}</h4>
              <small>{d[1]} employees</small>
              <div className="row-bet"><span>Engagement</span><strong>{d[2]}%</strong></div>
              <ProgressBar value={d[2] as number} />
            </article>
          ))}
        </div>
      </section>
      <section className="card panel">
        <h2>Payroll Sync Status</h2>
        <div className="grid cols-3">
          {['greytHR', 'RazorpayX Payroll', 'Zoho People'].map((s) => (
            <article className="soft-card" key={s}><strong>{s}</strong><span>Connected</span></article>
          ))}
        </div>
      </section>
    </div>
  );
}

