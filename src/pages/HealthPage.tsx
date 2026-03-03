import { Heart, Activity, Brain } from 'lucide-react';
import { LineTrendChart } from '../components/charts';
import { SectionTitle, StatCard } from '../components/ui';

export function HealthPage() {
  return (
    <div className="page page-health">
      <SectionTitle title="Health Intelligence" subtitle="Analytics-driven health insights at company level" />
      <div className="grid cols-3">
        <StatCard title="Mental Health Index" subtitle="Company aggregate" value="82" delta="+5 points from last month" icon={<Brain size={16} />} />
        <StatCard title="Physical Health Index" subtitle="Company aggregate" value="75" delta="+1 point from last month" icon={<Heart size={16} />} />
        <StatCard title="Overall Engagement" subtitle="Quarterly measure" value="78%" delta="+3% this quarter" icon={<Activity size={16} />} />
      </div>
      <div className="grid cols-2-big">
        <section className="card panel"><h2>Mental Health Index Trend</h2><LineTrendChart /></section>
        <section className="card panel"><h2>Physical Health Index Trend</h2><LineTrendChart color="var(--danger)" /></section>
      </div>
      <section className="card panel">
        <h2>Preventive Care Participation</h2>
        {[
          ['Health Screening', 84], ['Mental Wellness', 78], ['Fitness Programs', 62], ['Nutrition Counseling', 45], ['Sleep Therapy', 38],
        ].map((p) => (
          <div className="hbar" key={p[0]}><span>{p[0]}</span><div><i style={{ width: `${p[1]}%` }} /></div></div>
        ))}
      </section>
    </div>
  );
}
