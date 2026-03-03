import { SectionTitle } from '../components/ui';

export function PoliciesPage() {
  return (
    <div className="page page-policies">
      <SectionTitle title="Policies & Privacy" subtitle="Governance for health data, payroll integration, and compliance" />
      <div className="grid cols-2">
        <section className="card panel">
          <h2>Data Governance</h2>
          <ul className="list">
            <li>Only anonymized, aggregated employee health data is visible.</li>
            <li>No individual diagnosis or medical records in corporate dashboard.</li>
            <li>HIPAA-aligned access controls and audit logs enabled.</li>
            <li>Payroll metadata stored separately from health trend data.</li>
          </ul>
        </section>
        <section className="card panel">
          <h2>Program Policies</h2>
          <ul className="list">
            <li>Auto-refill triggers at 20% credit balance.</li>
            <li>Monthly ROI report delivered to finance owners.</li>
            <li>At-risk forecast alerts sent to HR and wellness heads.</li>
            <li>Integration credentials rotate every 30 days.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
