import { useMemo, useState } from "react";
import { Users, WalletCards, ChartNoAxesColumnIncreasing, Clock3 } from "lucide-react";
import { LineTrendChart, RingScore } from "../components/charts";
import { AnalysisRangeBar, SectionTitle, StatCard } from "../components/ui";
import type { AnalysisRange } from "../components/ui";

const multiplier: Record<AnalysisRange, number> = {
  Week: 0.26,
  Month: 1,
  Year: 12,
};

const metricCards = [
  { title: "Credit Coins Remaining", subtitle: "Employees using for services", value: 3710000, delta: "-128K today", icon: <WalletCards size={16} />, tone: "brand" as const, deltaTone: "negative" as const },
  { title: "Daily Burn Rate", subtitle: "Active service usage", value: 128000, delta: "+8% vs last week", icon: <ChartNoAxesColumnIncreasing size={16} />, tone: "warning" as const, deltaTone: "positive" as const },
  { title: "Credits Last For", subtitle: "At current usage rate", value: 29, delta: "Runway healthy", icon: <Clock3 size={16} />, tone: "info" as const, deltaTone: "positive" as const },
  { title: "Employee Engagement", subtitle: "Actively using services", value: 92.3, delta: "+2.1% this month", icon: <Users size={16} />, tone: "success" as const, deltaTone: "positive" as const },
];

export function CommandCenterPage() {
  const [range, setRange] = useState<AnalysisRange>("Month");
  const factor = multiplier[range];

  const cards = useMemo(() => {
    return metricCards.map((card) => {
      if (card.title === "Credits Last For") return { ...card, value: `${Math.max(Math.round(card.value / factor), 1)} days` };
      if (card.title === "Employee Engagement") return { ...card, value: `${Math.min(Math.round(card.value), 99)}%` };
      return { ...card, value: `${Math.round(card.value * factor).toLocaleString("en-IN")}` };
    });
  }, [factor]);

  return (
    <div className="page page-command">
      <SectionTitle title="Dashboard" subtitle={`See key health and credit numbers (${range} analysis)`} action={<button className="primary-btn">Refill Credits</button>} />
      <AnalysisRangeBar value={range} onChange={setRange} />
      <div className="grid cols-4">{cards.map((card) => <StatCard key={card.title} {...card} />)}</div>
      <div className="grid cols-2-big">
        <section className="card panel">
          <div className="panel-head">
            <h2>Credit Balance Trend</h2>
            <button className="ghost-btn">Refill Now</button>
          </div>
          <div className="highlight-strip">
            <div><small>Current Balance</small><strong>{cards[0]?.value}</strong></div>
            <div><small>Will last for</small><strong>{cards[2]?.value}</strong></div>
          </div>
          <LineTrendChart />
        </section>
        <section className="card panel">
          <h2>Overall Wellness Index</h2>
          <p className="muted">Company-wide aggregate ({range})</p>
          <RingScore score={range === "Year" ? 81 : range === "Week" ? 76 : 78} label="Healthy" />
          <div className="kpi-list">
            <div><span>Service Utilization</span><strong>{range === "Year" ? "86%" : range === "Week" ? "79%" : "82%"}</strong></div>
            <div><span>Active Users</span><strong>{range === "Year" ? "94%" : range === "Week" ? "89%" : "92%"}</strong></div>
            <div><span>Engagement Score</span><strong>{range === "Year" ? "88%" : range === "Week" ? "82%" : "85%"}</strong></div>
          </div>
        </section>
      </div>
    </div>
  );
}
