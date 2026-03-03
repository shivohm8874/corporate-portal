import { SectionTitle } from '../components/ui';

export function ReportsPage() {
  return (
    <div className="page page-reports">
      <SectionTitle title="Reports" subtitle="Generate and download business reports" />
      <section className="card panel">
        <div className="grid cols-3">
          {[
            ['Executive ROI Report', 'Monthly board-ready summary of savings and outcomes'],
            ['Payroll Wellness Correlation', 'How payroll trends align with health program usage'],
            ['Health Risk Prediction', 'Forecast probability and intervention recommendations'],
            ['Department Wellness Score', 'Cross-team engagement and participation scores'],
            ['Credit Utilization Ledger', 'Detailed credit burn and refill timeline'],
            ['Compliance & Audit Report', 'Policy adherence and integration access audit'],
          ].map((r) => (
            <article className="soft-card" key={r[0]}>
              <strong>{r[0]}</strong>
              <span>{r[1]}</span>
              <button className="ghost-btn">Generate</button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

