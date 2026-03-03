import { Users, WalletCards, ChartNoAxesColumnIncreasing, Clock3 } from 'lucide-react';
import { LineTrendChart, RingScore } from '../components/charts';
import { SectionTitle, StatCard } from '../components/ui';

const metricCards = [
  { title: 'Credit Coins Remaining', subtitle: 'Employees using for services', value: '37.1L', delta: '-128K today', icon: <WalletCards size={16} />, tone: 'brand' as const, deltaTone: 'negative' as const },
  { title: 'Daily Burn Rate', subtitle: 'Active service usage', value: '128K', delta: '+8% vs last week', icon: <ChartNoAxesColumnIncreasing size={16} />, tone: 'warning' as const, deltaTone: 'positive' as const },
  { title: 'Credits Last For', subtitle: 'At current usage rate', value: '29 days', delta: 'Runway healthy', icon: <Clock3 size={16} />, tone: 'info' as const, deltaTone: 'positive' as const },
  { title: 'Employee Engagement', subtitle: 'Actively using services', value: '92.3%', delta: '+2.1% this month', icon: <Users size={16} />, tone: 'success' as const, deltaTone: 'positive' as const },
];

export function CommandCenterPage() {
  return (
    <div className="page page-command">
      <SectionTitle title="Dashboard" subtitle="See your key health and credit numbers in one place" action={<button className="primary-btn">Refill Credits</button>} />
      <div className="grid cols-4">{metricCards.map((card) => <StatCard key={card.title} {...card} />)}</div>
      <div className="grid cols-2-big">
        <section className="card panel">
          <div className="panel-head">
            <h2>Credit Balance Trend</h2>
            <button className="ghost-btn">Refill Now</button>
          </div>
          <div className="highlight-strip">
            <div><small>Current Balance</small><strong>₹37.1L</strong></div>
            <div><small>Will last for</small><strong>29 days</strong></div>
          </div>
          <LineTrendChart />
        </section>
        <section className="card panel">
          <h2>Overall Wellness Index</h2>
          <p className="muted">Company-wide aggregate only</p>
          <RingScore score={78} label="Healthy" />
          <div className="kpi-list">
            <div><span>Service Utilization</span><strong>82%</strong></div>
            <div><span>Active Users</span><strong>92%</strong></div>
            <div><span>Engagement Score</span><strong>85%</strong></div>
          </div>
        </section>
      </div>
      <section className="card panel">
        <div className="panel-head"><h2>Time & Productivity Savings</h2><span className="chip chip-green">2,180 hours saved this month</span></div>
        <div className="grid cols-3">
          {[
            ['Tele-consultations', '940 hrs', 'No hospital visits needed'],
            ['In-office Medicine', '680 hrs', 'No pharmacy trips'],
            ['On-site Lab Tests', '560 hrs', 'Done at office'],
          ].map((item) => (
            <div className="soft-card" key={item[0]}>
              <small>{item[0]}</small><strong>{item[1]}</strong><span>{item[2]}</span>
            </div>
          ))}
        </div>
        <LineTrendChart color="var(--good)" />
      </section>
      <section className="card panel">
        <div className="panel-head"><h2>Active Alerts</h2><button className="text-btn">View all</button></div>
        {[
          ['Low Credit Balance Alert', 'warning', 'Coins will run out in 28 days at current burn rate.'],
          ['High Employee Engagement', 'success', '92% employees actively using wellness services.'],
          ['Time Savings Milestone', 'info', '2,180 hours saved this month through on-site services.'],
        ].map((a) => (
          <article className="alert-row" key={a[0]}>
            <div><h4>{a[0]} <span className={`chip chip-${a[1]}`}>{a[1]}</span></h4><p>{a[2]}</p></div>
            <button className="link-btn">Open</button>
          </article>
        ))}
      </section>
    </div>
  );
}

