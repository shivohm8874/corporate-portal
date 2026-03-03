import { SectionTitle } from '../components/ui';

export function AlertsPage() {
  return (
    <div className="page page-alerts">
      <SectionTitle title="Alerts" subtitle="Live operational and wellness risk alerts" />
      <section className="card panel">
        {[
          ['Credit burn spike in South region', 'High', 'Daily burn rate +19% above baseline'],
          ['Payroll sync failure - Keka', 'Critical', 'Authentication token expired, reconnect required'],
          ['Mental wellness drop predicted', 'Medium', 'Predicted -4 points in two departments'],
          ['Strong ROI opportunity in Operations', 'Info', 'Adopt preventive screening to save additional ₹4.2L'],
        ].map((a) => (
          <article className="alert-row" key={a[0]}>
            <div><h4>{a[0]}</h4><p>{a[2]}</p></div>
            <span className="chip chip-warning">{a[1]}</span>
          </article>
        ))}
      </section>
    </div>
  );
}
