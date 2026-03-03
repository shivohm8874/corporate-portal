import { BadgeIndianRupee, Sparkles, ChartNoAxesColumnIncreasing, WalletCards } from 'lucide-react';
import { SavingsCompareChart } from '../components/charts';
import { SectionTitle, StatCard } from '../components/ui';

export function SavingsPage() {
  return (
    <div className="page page-savings">
      <SectionTitle title="Savings & ROI Engine" subtitle="Clear proof of how employee wellness saves your company money" />
      <div className="grid cols-4">
        <StatCard title="This Month Saved" subtitle="vs traditional healthcare" value="₹63.2L" delta="Strong performance" icon={<Sparkles size={16} />} />
        <StatCard title="Projected Annual Savings" subtitle="Based on current trends" value="₹7.2Cr" delta="Growing +18% YoY" icon={<ChartNoAxesColumnIncreasing size={16} />} />
        <StatCard title="Return on Investment" subtitle="Program efficiency" value="324%" delta="Cost recovered 3.24x" icon={<BadgeIndianRupee size={16} />} />
        <StatCard title="Cost per Employee" subtitle="Total annualized" value="₹14,166" delta="Down by 12%" icon={<WalletCards size={16} />} />
      </div>
      <section className="card panel">
        <h2>How We Save You Money</h2>
        {[
          ['Hospital Visits Avoided', '₹21.0L'],
          ['In-office Medicine Savings', '₹8.9L'],
          ['Lab Tests at Office', '₹5.6L'],
          ['Reduced Sick Days', '₹12.4L'],
          ['Preventive Care Impact', '₹8.6L'],
        ].map((s) => (
          <div className="save-row" key={s[0]}><span>{s[0]}</span><strong>+{s[1]}</strong></div>
        ))}
        <div className="highlight-strip"><strong>Total Monthly Savings ₹56.5L | Projected Annual ₹6.8Cr</strong></div>
      </section>
      <section className="card panel"><h2>Cost Comparison: Traditional vs Wellness Program</h2><SavingsCompareChart /></section>
    </div>
  );
}
