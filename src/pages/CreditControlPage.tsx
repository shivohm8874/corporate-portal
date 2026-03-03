import { Clock3, ChartNoAxesColumnIncreasing, WalletCards } from 'lucide-react';
import { CreditsUsagePie, MonthlyBurnChart } from '../components/charts';
import { SectionTitle, StatCard } from '../components/ui';

export function CreditControlPage() {
  const packages = [
    { name: 'Starter Pack', credits: '₹20L', pay: '₹2.00L', note: '' },
    { name: 'Growth Pack', credits: '₹50L', pay: '₹4.75L', note: 'Recommended' },
    { name: 'Enterprise Pack', credits: '₹100L', pay: '₹9.00L', note: '' },
  ];

  return (
    <div className="page page-credit">
      <SectionTitle title="Credit Management" subtitle="Track credit balance and refill when required" />
      <div className="grid cols-3">
        <StatCard title="Current Balance" subtitle="Employees using for services" value="₹37.1L" delta="Active" icon={<WalletCards size={16} />} />
        <StatCard title="Credits Will Last" subtitle="At this burn rate" value="29 days" delta="Healthy" icon={<Clock3 size={16} />} />
        <StatCard title="Daily Burn Rate" subtitle="Average daily usage" value="₹128K" delta="Stable" icon={<ChartNoAxesColumnIncreasing size={16} />} />
      </div>
      <div className="grid cols-2-big">
        <section className="card panel">
          <h2>How Credits Are Being Used</h2>
          <CreditsUsagePie />
          <div className="list-metrics">
            <div><span>Tele-consultations</span><strong>₹12.8L</strong></div>
            <div><span>In-office Medicine</span><strong>₹11.5L</strong></div>
            <div><span>Lab Tests (On-site)</span><strong>₹8.9L</strong></div>
            <div><span>Insurance Recovery</span><strong>₹3.9L</strong></div>
          </div>
          <div className="highlight-strip"><strong>Total Spent This Month: ₹37.1L</strong></div>
        </section>
        <section className="card panel">
          <h2>Monthly Burn Rate Trend</h2>
          <MonthlyBurnChart />
          <div className="highlight-strip"><strong>Average Monthly Burn ₹35.5L</strong></div>
        </section>
      </div>
      <section className="card panel">
        <h2>Refill Credits</h2>
        <p className="muted">Purchase credit packages to keep services running for your employees</p>
        <div className="grid cols-4">
          {packages.map((p) => (
            <article className={`package-card ${p.note ? 'package-active' : ''}`} key={p.name}>
              {p.note && <span className="chip chip-green">{p.note}</span>}
              <h4>{p.name}</h4>
              <strong>{p.credits}</strong>
              <p>Pay: {p.pay}</p>
            </article>
          ))}
          <article className="package-card">
            <h4>Custom Amount</h4>
            <input className="input" placeholder="Enter amount" />
            <p>Set your own amount</p>
          </article>
        </div>
        <button className="primary-btn full">Proceed to Payment</button>
      </section>
    </div>
  );
}

