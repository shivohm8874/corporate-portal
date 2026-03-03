import { AlertTriangle, Target, UsersRound, ChartNoAxesColumnIncreasing } from 'lucide-react';
import { ProgressBar, SectionTitle, StatCard } from '../components/ui';

export function ProgramsPage() {
  return (
    <div className="page page-programs">
      <SectionTitle title="Programs & Interventions" subtitle="Track active health programs and participation metrics" action={<button className="primary-btn">+ Launch Program</button>} />
      <div className="grid cols-4">
        <StatCard title="Active Programs" subtitle="Currently running" value="4" delta="+1 started this month" icon={<Target size={16} />} />
        <StatCard title="Total Participants" subtitle="Across all programs" value="2,247" delta="84% of workforce" icon={<UsersRound size={16} />} />
        <StatCard title="Avg Completion" subtitle="Program completion" value="66.2%" delta="+5.4% monthly" icon={<ChartNoAxesColumnIncreasing size={16} />} />
        <StatCard title="Avg Drop-off" subtitle="Disengagement" value="10.9%" delta="-2.2% monthly" icon={<AlertTriangle size={16} />} />
      </div>
      <section className="card panel">
        <h2>Health Programs</h2>
        {[
          ['Mental Wellness Program', 83.7, 8.2],
          ['Fitness Challenge 2026', 67.8, 12.5],
          ['Preventive Health Screening', 80.2, 4.1],
          ['Nutrition Workshop Series', 33.2, 18.7],
          ['Sleep Improvement Program', 24.4, 22.3],
        ].map((p) => (
          <article className="program-row" key={p[0]}>
            <div className="row-bet"><h4>{p[0]}</h4><button className="ghost-btn">View details</button></div>
            <small>Participation Rate</small>
            <ProgressBar value={p[1] as number} />
            <div className="row-bet"><span>Completion {p[1]}%</span><span className="danger">Drop-off {p[2]}%</span></div>
          </article>
        ))}
      </section>
    </div>
  );
}
