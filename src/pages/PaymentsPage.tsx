import { SectionTitle } from '../components/ui';

export function PaymentsPage() {
  return (
    <div className="page page-payments">
      <SectionTitle title="Payments & Billing" subtitle="Transaction history and invoices" />
      <div className="grid cols-3">
        {[
          ['PAY-2847', 'Feb 22, 2026', '₹100,000', '100,000 credits'],
          ['PAY-2846', 'Jan 18, 2026', '₹200,000', '200,000 credits'],
          ['PAY-2845', 'Dec 12, 2025', '₹150,000', '150,000 credits'],
        ].map((i) => (
          <article className="card payment-card" key={i[0]}>
            <div className="row-bet"><small>{i[0]}</small><span className="chip chip-green">completed</span></div>
            <small>{i[1]}</small>
            <strong>{i[2]}</strong>
            <span>{i[3]}</span>
          </article>
        ))}
      </div>
      <section className="card panel">
        <h2>Payment Timeline</h2>
        {[
          ['Dec 2025', 74, '₹177,000'],
          ['Jan 2026', 100, '₹236,000'],
          ['Feb 2026', 49, '₹118,000'],
        ].map((row) => (
          <div className="hbar" key={row[0]}>
            <span>{row[0]}</span>
            <div><i style={{ width: `${row[1]}%` }} /><b>{row[2]}</b></div>
          </div>
        ))}
      </section>
      <section className="card panel">
        <div className="panel-head"><h2>Invoices</h2><button className="ghost-btn">Download all</button></div>
        {[
          ['INV-2026-024', 'Feb 22, 2026', '₹118,000'],
          ['INV-2026-018', 'Jan 18, 2026', '₹236,000'],
          ['INV-2025-345', 'Dec 12, 2025', '₹177,000'],
        ].map((inv) => (
          <article className="invoice-row" key={inv[0]}>
            <div><strong>{inv[0]}</strong><small>{inv[1]}</small></div>
            <div className="row-bet"><strong>{inv[2]}</strong><button className="link-btn">Download</button></div>
          </article>
        ))}
      </section>
    </div>
  );
}
