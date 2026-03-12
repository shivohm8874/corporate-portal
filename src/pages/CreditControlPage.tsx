import { useMemo, useState } from "react";
import { CheckCircle2, Clock3, CreditCard, Landmark, Link2, WalletCards, ChartNoAxesColumnIncreasing } from "lucide-react";
import { CreditsUsagePie, MonthlyBurnChart } from "../components/charts";
import { AnalysisRangeBar, SectionTitle, StatCard } from "../components/ui";
import type { AnalysisRange } from "../components/ui";

type PaymentMethod = "UPI" | "Card" | "Net Banking";

type CreditPack = {
  id: string;
  name: string;
  credits: number;
  bonusCredits: number;
  note?: string;
};

const CREDITS_PER_INR = 10;

const creditPacks: CreditPack[] = [
  { id: "starter", name: "Starter Pack", credits: 100000, bonusCredits: 0 },
  { id: "growth", name: "Growth Pack", credits: 200000, bonusCredits: 10000, note: "Recommended" },
  { id: "enterprise", name: "Enterprise Pack", credits: 500000, bonusCredits: 40000 },
];

function formatInr(amount: number) {
  return `INR ${amount.toLocaleString("en-IN")}`;
}

function toPayableAmount(credits: number) {
  return Math.ceil(credits / CREDITS_PER_INR);
}

function formatCredits(credits: number) {
  return `${credits.toLocaleString("en-IN")} credits`;
}

export function CreditControlPage() {
  const [range, setRange] = useState<AnalysisRange>("Month");
  const [currentCredits, setCurrentCredits] = useState(371000);
  const [selectedPackId, setSelectedPackId] = useState<string>("growth");
  const [customCredits, setCustomCredits] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("UPI");
  const [billingEmail, setBillingEmail] = useState("finance@hcl.com");
  const [purchaseOrder, setPurchaseOrder] = useState("PO-2026-118");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState("");

  const selectedPack = useMemo(
    () => creditPacks.find((pack) => pack.id === selectedPackId) ?? null,
    [selectedPackId]
  );

  const selectedCredits = useMemo(() => {
    const custom = Number(customCredits) || 0;
    if (custom > 0) return custom;
    if (!selectedPack) return 0;
    return selectedPack.credits + selectedPack.bonusCredits;
  }, [customCredits, selectedPack]);

  const payableAmount = useMemo(() => toPayableAmount(selectedCredits), [selectedCredits]);
  const rangeFactor = range === "Week" ? 0.26 : range === "Year" ? 12 : 1;
  const dailyBurn = Math.round(12800 * rangeFactor);
  const daysLeft = Math.max(Math.floor(currentCredits / Math.max(dailyBurn, 1)), 0);

  function handleProceedPayment() {
    if (!selectedCredits || !billingEmail.trim() || !purchaseOrder.trim()) {
      setCheckoutMessage("Select credits and enter billing details before proceeding.");
      return;
    }
    setCheckoutMessage("");
    setProcessingPayment(true);

    window.setTimeout(() => {
      setCurrentCredits((prev) => prev + selectedCredits);
      setProcessingPayment(false);
      setCheckoutMessage(
        `Payment successful via ${paymentMethod}. ${formatCredits(selectedCredits)} added. Transaction ID: TXN-${Date.now().toString().slice(-6)}.`
      );
      setCustomCredits("");
    }, 1200);
  }

  return (
    <div className="page page-credit">
      <SectionTitle title="Credit Management" subtitle={`Track credit balance and refill with finance-ready checkout controls (${range} analysis)`} />
      <AnalysisRangeBar value={range} onChange={setRange} />

      <div className="grid cols-3">
        <StatCard title="Current Balance" subtitle="Available for employees" value={formatCredits(currentCredits)} delta="Active" icon={<WalletCards size={16} />} />
        <StatCard title="Credits Will Last" subtitle="At this burn rate" value={`${daysLeft} days`} delta={daysLeft < 21 ? "Low buffer" : "Healthy"} icon={<Clock3 size={16} />} />
        <StatCard title="Daily Burn Rate" subtitle="Average daily usage" value={formatCredits(dailyBurn)} delta="Stable" icon={<ChartNoAxesColumnIncreasing size={16} />} />
      </div>

      <div className="grid cols-2-big">
        <section className="card panel">
          <h2>How Credits Are Being Used</h2>
          <CreditsUsagePie />
          <div className="list-metrics">
            <div><span>Tele-consultations</span><strong>128,000 credits</strong></div>
            <div><span>In-office Medicine</span><strong>115,000 credits</strong></div>
            <div><span>Lab Tests (On-site)</span><strong>89,000 credits</strong></div>
            <div><span>Insurance Recovery</span><strong>39,000 credits</strong></div>
          </div>
          <div className="highlight-strip"><strong>Total Spent This Month: 371,000 credits</strong></div>
        </section>

        <section className="card panel">
          <h2>Monthly Burn Rate Trend</h2>
          <MonthlyBurnChart />
          <div className="highlight-strip"><strong>Average Monthly Burn: 355,000 credits</strong></div>
        </section>
      </div>

      <section className="card panel">
        <div className="panel-head">
          <div>
            <h2>Refill Credits</h2>
            <p className="muted">Choose package or custom credits, then proceed to finance checkout.</p>
          </div>
          <span className="chip chip-info">Realtime Refill Enabled</span>
        </div>

        <div className="grid cols-4">
          {creditPacks.map((pack) => {
            const isActive = customCredits.trim() === "" && selectedPackId === pack.id;
            const totalCredits = pack.credits + pack.bonusCredits;
            return (
              <button
                type="button"
                className={`package-card package-clickable ${isActive ? "package-active" : ""}`}
                key={pack.id}
                onClick={() => {
                  setSelectedPackId(pack.id);
                  setCustomCredits("");
                }}
              >
                <div className="row-bet">
                  <h4>{pack.name}</h4>
                  {pack.note ? <span className="chip chip-green">{pack.note}</span> : null}
                </div>
                <strong>{formatCredits(totalCredits)}</strong>
                <p>Payable: {formatInr(toPayableAmount(totalCredits))}</p>
                {pack.bonusCredits > 0 ? <small className="muted">Includes bonus: {formatCredits(pack.bonusCredits)}</small> : null}
              </button>
            );
          })}

          <article className="package-card">
            <h4>Custom Refill</h4>
            <input
              className="input"
              placeholder="Enter custom credits"
              value={customCredits}
              onChange={(event) => setCustomCredits(event.target.value)}
            />
            <p>{customCredits ? `Payable: ${formatInr(toPayableAmount(Number(customCredits) || 0))}` : "Set your own credit amount"}</p>
            {customCredits ? <small className="muted">Custom refill selected</small> : null}
          </article>
        </div>

        <div className="payment-checkout-grid">
          <article className="checkout-card">
            <h3>Payment Details</h3>
            <label>
              Billing Email
              <input className="input" value={billingEmail} onChange={(event) => setBillingEmail(event.target.value)} placeholder="finance@company.com" />
            </label>
            <label>
              Purchase Order ID
              <input className="input" value={purchaseOrder} onChange={(event) => setPurchaseOrder(event.target.value)} placeholder="PO-2026-118" />
            </label>
            <label>
              Payment Method
              <select className="input" value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value as PaymentMethod)}>
                <option value="UPI">UPI</option>
                <option value="Card">Corporate Card</option>
                <option value="Net Banking">Net Banking</option>
              </select>
            </label>
          </article>

          <article className="checkout-card checkout-summary">
            <h3>Order Summary</h3>
            <div className="summary-row"><span>Credits to add</span><strong>{formatCredits(selectedCredits)}</strong></div>
            <div className="summary-row"><span>Payable amount</span><strong>{formatInr(payableAmount)}</strong></div>
            <div className="summary-row"><span>Method</span><strong>{paymentMethod}</strong></div>
            <div className="summary-row"><span>Expected posting</span><strong>Under 2 minutes</strong></div>
            <button className="primary-btn full" onClick={handleProceedPayment} disabled={processingPayment || selectedCredits <= 0}>
              {processingPayment ? "Processing Payment..." : "Proceed to Payment"}
            </button>
          </article>
        </div>

        {checkoutMessage ? (
          <div className="checkout-status">
            {checkoutMessage.toLowerCase().includes("successful") ? <CheckCircle2 size={16} /> : <Link2 size={16} />}
            <span>{checkoutMessage}</span>
          </div>
        ) : null}

        <div className="payment-method-row">
          <span><CreditCard size={14} /> Card/UPI backed by gateway tokenization</span>
          <span><Landmark size={14} /> Bank transfer reconciliation supported</span>
        </div>
      </section>
    </div>
  );
}
