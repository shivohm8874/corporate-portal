import { useMemo, useState } from 'react';
import { Activity, ArrowDownToLine, Banknote, CalendarClock, CircleDollarSign, Download, Search, ShieldCheck, Wallet } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { jsPDF } from 'jspdf';
import { AnalysisRangeBar, SectionTitle, StatCard } from '../components/ui';
import type { AnalysisRange } from '../components/ui';

type InvoiceStatus = 'paid' | 'pending' | 'overdue';

type Transaction = {
  id: string;
  date: string;
  amount: string;
  credits: string;
  status: 'completed' | 'processing';
  method: string;
};

type Invoice = {
  id: string;
  date: string;
  base: string;
  gst: string;
  total: string;
  status: InvoiceStatus;
  aging: string;
};

const transactions: Transaction[] = [
  { id: 'PAY-2847', date: 'Feb 22, 2026', amount: '₹100,000', credits: '100,000 credits', status: 'completed', method: 'RazorpayX' },
  { id: 'PAY-2846', date: 'Jan 18, 2026', amount: '₹200,000', credits: '200,000 credits', status: 'completed', method: 'RazorpayX' },
  { id: 'PAY-2845', date: 'Dec 12, 2025', amount: '₹150,000', credits: '150,000 credits', status: 'completed', method: 'RazorpayX' },
  { id: 'PAY-2848', date: 'Mar 01, 2026', amount: '₹80,000', credits: '80,000 credits', status: 'processing', method: 'Bank Transfer' },
];

const invoices: Invoice[] = [
  { id: 'INV-2026-024', date: 'Feb 22, 2026', base: '₹100,000', gst: '₹18,000', total: '₹118,000', status: 'paid', aging: 'Paid in 1 day' },
  { id: 'INV-2026-018', date: 'Jan 18, 2026', base: '₹200,000', gst: '₹36,000', total: '₹236,000', status: 'paid', aging: 'Paid in 2 days' },
  { id: 'INV-2025-345', date: 'Dec 12, 2025', base: '₹150,000', gst: '₹27,000', total: '₹177,000', status: 'paid', aging: 'Paid in 1 day' },
  { id: 'INV-2026-030', date: 'Mar 02, 2026', base: '₹110,000', gst: '₹19,800', total: '₹129,800', status: 'pending', aging: 'Due in 4 days' },
  { id: 'INV-2026-012', date: 'Jan 07, 2026', base: '₹74,000', gst: '₹13,320', total: '₹87,320', status: 'overdue', aging: 'Overdue by 3 days' },
];

const monthlyBillingData = [
  { month: 'Sep', paid: 198, budget: 220 },
  { month: 'Oct', paid: 214, budget: 220 },
  { month: 'Nov', paid: 236, budget: 240 },
  { month: 'Dec', paid: 177, budget: 210 },
  { month: 'Jan', paid: 236, budget: 240 },
  { month: 'Feb', paid: 118, budget: 170 },
  { month: 'Mar', paid: 130, budget: 180 },
];

const monthLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function statusChipClass(status: InvoiceStatus) {
  if (status === 'paid') return 'chip chip-green';
  if (status === 'pending') return 'chip chip-warning';
  return 'chip chip-danger';
}

export function PaymentsPage() {
  const [range, setRange] = useState<AnalysisRange>('Month');
  const [statusFilter, setStatusFilter] = useState<'all' | InvoiceStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportMonth, setExportMonth] = useState(new Date().getMonth());
  const [exportYear, setExportYear] = useState(new Date().getFullYear());
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportStatus, setExportStatus] = useState('');

  const filteredInvoices = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return invoices.filter((invoice) => {
      const passStatus = statusFilter === 'all' || invoice.status === statusFilter;
      const passQuery = !query || invoice.id.toLowerCase().includes(query) || invoice.date.toLowerCase().includes(query);
      return passStatus && passQuery;
    });
  }, [searchQuery, statusFilter]);

  const exportYearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 6 }, (_, index) => currentYear - 4 + index);
  }, []);
  const rangeFactor = range === 'Week' ? 0.26 : range === 'Year' ? 12 : 1;
  const billed = Math.round(471000 * rangeFactor);
  const pending = Math.round(129000 * rangeFactor);
  const purchased = Math.round(530000 * rangeFactor);

  const parseAmount = (value: string) => Number(value.replace(/[^0-9.]/g, '')) || 0;
  const getDate = (value: string) => new Date(value);
  const sameMonthYear = (value: string, month: number, year: number) => {
    const d = getDate(value);
    return d.getMonth() === month && d.getFullYear() === year;
  };

  function exportReportPdf() {
    setExportingPdf(true);
    setExportStatus('');
    const selectedInvoices = invoices.filter((item) => sameMonthYear(item.date, exportMonth, exportYear));
    const selectedTransactions = transactions.filter((item) => sameMonthYear(item.date, exportMonth, exportYear));
    const totalInvoiceValue = selectedInvoices.reduce((sum, item) => sum + parseAmount(item.total), 0);
    const totalTransactionValue = selectedTransactions.reduce((sum, item) => sum + parseAmount(item.amount), 0);

    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    let y = 50;
    const lineGap = 20;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Billing & Payments Report', 40, y);
    y += lineGap;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`Period: ${monthLabels[exportMonth]} ${exportYear}`, 40, y);
    y += lineGap;
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 40, y);
    y += lineGap * 1.5;

    doc.setFont('helvetica', 'bold');
    doc.text('Summary', 40, y);
    y += lineGap;
    doc.setFont('helvetica', 'normal');
    doc.text(`Invoices: ${selectedInvoices.length}`, 40, y);
    y += lineGap;
    doc.text(`Transactions: ${selectedTransactions.length}`, 40, y);
    y += lineGap;
    doc.text(`Invoice total: INR ${totalInvoiceValue.toLocaleString('en-IN')}`, 40, y);
    y += lineGap;
    doc.text(`Collection total: INR ${totalTransactionValue.toLocaleString('en-IN')}`, 40, y);
    y += lineGap * 1.5;

    doc.setFont('helvetica', 'bold');
    doc.text('Invoices', 40, y);
    y += lineGap;
    doc.setFont('helvetica', 'normal');
    if (selectedInvoices.length === 0) {
      doc.text('No invoices found for this period.', 40, y);
      y += lineGap;
    } else {
      selectedInvoices.forEach((item) => {
        doc.text(`${item.id} | ${item.date} | ${item.total} | ${item.status}`, 40, y);
        y += lineGap;
      });
    }

    y += lineGap * 0.5;
    doc.setFont('helvetica', 'bold');
    doc.text('Transactions', 40, y);
    y += lineGap;
    doc.setFont('helvetica', 'normal');
    if (selectedTransactions.length === 0) {
      doc.text('No transactions found for this period.', 40, y);
    } else {
      selectedTransactions.forEach((item) => {
        doc.text(`${item.id} | ${item.date} | ${item.amount} | ${item.status}`, 40, y);
        y += lineGap;
      });
    }

    const monthNum = String(exportMonth + 1).padStart(2, '0');
    doc.save(`billing-report-${exportYear}-${monthNum}.pdf`);
    setExportingPdf(false);
    setExportStatus(`Report exported: ${monthLabels[exportMonth]} ${exportYear} (PDF).`);
    setExportModalOpen(false);
  }

  return (
    <div className="page page-payments">
      <SectionTitle
        title="Billing & Payments"
        subtitle={`Track payment operations, invoice status, and spend trends (${range} analysis).`}
        action={
          <div className="row-gap">
            <button className="ghost-btn" onClick={() => setExportModalOpen(true)}><ArrowDownToLine size={15} />Export report</button>
            <button className="primary-btn"><CircleDollarSign size={15} />Record payment</button>
          </div>
        }
      />
      <AnalysisRangeBar value={range} onChange={setRange} />
      {exportStatus && <p className="export-status">{exportStatus}</p>}

      <div className="grid cols-4">
        <StatCard title="Current Billed Value" subtitle="Total posted invoices" value={`₹${billed.toLocaleString('en-IN')}`} delta="+9.3% trend" icon={<Banknote size={16} />} tone="info" />
        <StatCard title="Paid Collection Rate" subtitle="Settled within billing cycle" value="93.8%" delta="Strong collection health" icon={<ShieldCheck size={16} />} tone="success" />
        <StatCard title="Pending Collection" subtitle="Requires finance action" value={`₹${pending.toLocaleString('en-IN')}`} delta="Follow-up required" icon={<CalendarClock size={16} />} tone="warning" deltaTone="negative" />
        <StatCard title="Credits Purchased" subtitle="Across all payment methods" value={purchased.toLocaleString('en-IN')} delta="+trend over baseline" icon={<Wallet size={16} />} tone="brand" />
      </div>

      <div className="grid cols-2">
        <section className="card panel">
          <div className="panel-head">
            <h2>Recent Transactions</h2>
            <button className="ghost-btn">View all</button>
          </div>
          <div className="payment-transaction-list">
            {transactions.map((item) => (
              <article className="payment-transaction-card" key={item.id}>
                <div className="row-bet">
                  <div>
                    <strong>{item.id}</strong>
                    <small>{item.date}</small>
                  </div>
                  <span className={item.status === 'completed' ? 'chip chip-green' : 'chip chip-info'}>
                    {item.status}
                  </span>
                </div>
                <div className="payment-transaction-meta">
                  <strong>{item.amount}</strong>
                  <span>{item.credits}</span>
                </div>
                <div className="row-bet">
                  <small>{item.method}</small>
                  <button className="link-btn"><Download size={14} />Receipt</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="card panel">
          <h2>Billing Trend vs Budget</h2>
          <p className="muted">Monthly comparison in thousand rupees for better spend planning.</p>
          <div className="chart-wrap payment-chart">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthlyBillingData}>
                <XAxis dataKey="month" tick={{ fill: '#8c93a7', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#a3abc0', fontSize: 12 }} axisLine={false} tickLine={false} width={30} />
                <Tooltip />
                <Bar dataKey="budget" radius={[10, 10, 0, 0]} fill="#d9deee" />
                <Bar dataKey="paid" radius={[10, 10, 0, 0]} fill="url(#billingBars)" />
                <defs>
                  <linearGradient id="billingBars" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#9a69ff" />
                    <stop offset="100%" stopColor="#6838ea" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="card panel">
        <h2>Payment Timeline</h2>
        {[
          ['Dec 2025', 74, '₹177,000'],
          ['Jan 2026', 100, '₹236,000'],
          ['Feb 2026', 49, '₹118,000'],
          ['Mar 2026', 54, '₹129,800'],
        ].map((row) => (
          <div className="hbar" key={row[0]}>
            <span>{row[0]}</span>
            <div><i style={{ width: `${row[1]}%` }} /><b>{row[2]}</b></div>
          </div>
        ))}
      </section>

      <section className="card panel">
        <div className="panel-head">
          <div>
            <h2>Invoice Operations</h2>
            <p className="muted">Search, filter, and manage invoice actions from one place.</p>
          </div>
          <button className="ghost-btn"><Download size={15} />Download all</button>
        </div>

        <div className="invoice-toolbar">
          <label className="invoice-search">
            <Search size={15} />
            <input
              className="input"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search invoice by ID or date"
            />
          </label>
          <div className="invoice-filter-row">
            <button className={`ghost-btn ${statusFilter === 'all' ? 'active-filter' : ''}`} onClick={() => setStatusFilter('all')}>All</button>
            <button className={`ghost-btn ${statusFilter === 'paid' ? 'active-filter' : ''}`} onClick={() => setStatusFilter('paid')}>Paid</button>
            <button className={`ghost-btn ${statusFilter === 'pending' ? 'active-filter' : ''}`} onClick={() => setStatusFilter('pending')}>Pending</button>
            <button className={`ghost-btn ${statusFilter === 'overdue' ? 'active-filter' : ''}`} onClick={() => setStatusFilter('overdue')}>Overdue</button>
          </div>
        </div>

        <div className="invoice-ops-grid">
          <div className="invoice-ops-head">
            <span>Invoice</span>
            <span>Base</span>
            <span>GST (18%)</span>
            <span>Total</span>
            <span>Status</span>
            <span>Action</span>
          </div>
          {filteredInvoices.length === 0 && (
            <article className="invoice-row">
              <div className="invoice-empty">
                <Activity size={16} />
                <span>No invoices found for current filters.</span>
              </div>
            </article>
          )}
          {filteredInvoices.map((invoice) => (
            <article className="invoice-row invoice-ops-row" key={invoice.id}>
              <div>
                <strong>{invoice.id}</strong>
                <small>{invoice.date}</small>
                <small>{invoice.aging}</small>
              </div>
              <strong>{invoice.base}</strong>
              <strong>{invoice.gst}</strong>
              <strong>{invoice.total}</strong>
              <span className={statusChipClass(invoice.status)}>{invoice.status}</span>
              <div className="invoice-actions">
                <button className="link-btn">View</button>
                <button className="link-btn"><Download size={14} />Download</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {exportModalOpen && (
        <div className="export-modal-overlay" role="dialog" aria-modal="true">
          <section className="export-modal-card">
            <h3>Export Billing Report (PDF)</h3>
            <p>Select month and year for export.</p>
            <label>
              Month
              <select className="input" value={exportMonth} onChange={(event) => setExportMonth(Number(event.target.value))}>
                {monthLabels.map((item, index) => (
                  <option value={index} key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              Year
              <select className="input" value={exportYear} onChange={(event) => setExportYear(Number(event.target.value))}>
                {exportYearOptions.map((year) => (
                  <option value={year} key={year}>{year}</option>
                ))}
              </select>
            </label>
            <div className="export-modal-actions">
              <button className="ghost-btn" onClick={() => setExportModalOpen(false)} disabled={exportingPdf}>Cancel</button>
              <button className="primary-btn" onClick={exportReportPdf} disabled={exportingPdf}>
                {exportingPdf ? 'Exporting...' : 'Export PDF'}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
