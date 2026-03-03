import { LineTrendChart } from '../components/charts';
import { SectionTitle, StatCard } from '../components/ui';

export function ForecastingPage() {
  return (
    <div className="page page-forecasting">
      <SectionTitle title="Health Forecasting" subtitle="Predict workforce health trends and likely outcomes" />
      <div className="grid cols-3">
        <StatCard title="Predicted Healthy Employees" subtitle="Upcoming period" value="2,534" delta="94.4% probability" />
        <StatCard title="At-Risk Cluster" subtitle="Needs intervention" value="151" delta="Mostly sleep and stress" />
        <StatCard title="Projected Cost Saved" subtitle="Upcoming period" value="₹22.8L" delta="Absenteeism reduction" />
      </div>
      <section className="card panel">
        <h2>Prediction Curve (Upcoming period)</h2>
        <LineTrendChart color="var(--blue)" />
        <div className="grid cols-3">
          <div className="soft-card"><strong>Confidence: 87%</strong><span>Model: blended trend + payroll cadence</span></div>
          <div className="soft-card"><strong>Key risk: high stress teams</strong><span>Recommend manager check-ins and sleep campaign</span></div>
          <div className="soft-card"><strong>Expected absenteeism drop: 11%</strong><span>Equivalent ~480 recovered work hours</span></div>
        </div>
      </section>
    </div>
  );
}
