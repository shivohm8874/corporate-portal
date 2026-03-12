import { useMemo, useState } from "react";
import { ArrowDownToLine, BadgeIndianRupee, ChartNoAxesColumnIncreasing, Sparkles, WalletCards } from "lucide-react";
import { jsPDF } from "jspdf";
import { SavingsBreakdownPie, SavingsCompareChart } from "../components/charts";
import { AnalysisRangeBar, ProgressBar, SectionTitle, StatCard } from "../components/ui";
import type { AnalysisRange } from "../components/ui";

type DepartmentRoi = {
  department: string;
  employees: number;
  programCostL: number;
  savingsL: number;
  roiPct: number;
  riskReductionPct: number;
};

type EmployeeSavings = {
  employeeId: string;
  name: string;
  department: string;
  month: number;
  year: number;
  investedCredits: number;
  savingsInr: number;
  roiPct: number;
  topContributors: string;
};

const departmentRoiData: DepartmentRoi[] = [
  { department: "Engineering", employees: 920, programCostL: 14.2, savingsL: 43.5, roiPct: 206, riskReductionPct: 18 },
  { department: "Sales", employees: 620, programCostL: 10.4, savingsL: 29.1, roiPct: 180, riskReductionPct: 15 },
  { department: "Operations", employees: 540, programCostL: 8.9, savingsL: 26.7, roiPct: 200, riskReductionPct: 17 },
  { department: "Finance", employees: 280, programCostL: 4.6, savingsL: 11.2, roiPct: 143, riskReductionPct: 9 },
  { department: "HR", employees: 240, programCostL: 3.8, savingsL: 9.1, roiPct: 139, riskReductionPct: 10 },
];

const quarterlyNetSavings = [
  { quarter: "Q2 FY25", netL: 39.8, progress: 56 },
  { quarter: "Q3 FY25", netL: 47.2, progress: 66 },
  { quarter: "Q4 FY25", netL: 58.6, progress: 81 },
  { quarter: "Q1 FY26", netL: 63.2, progress: 87 },
];

const employeeSavingsData: EmployeeSavings[] = [
  { employeeId: "E-102", name: "Priya Singh", department: "Engineering", month: 3, year: 2026, investedCredits: 24000, savingsInr: 7400, roiPct: 208, topContributors: "Teleconsult, Lab onsite" },
  { employeeId: "E-229", name: "Rohan Mehta", department: "Sales", month: 3, year: 2026, investedCredits: 21000, savingsInr: 6100, roiPct: 190, topContributors: "Preventive consult" },
  { employeeId: "E-355", name: "Anita Verma", department: "HR", month: 3, year: 2026, investedCredits: 18000, savingsInr: 4200, roiPct: 133, topContributors: "Mental health program" },
  { employeeId: "E-498", name: "Sameer Rao", department: "Operations", month: 2, year: 2026, investedCredits: 26000, savingsInr: 7800, roiPct: 200, topContributors: "Camp and screening" },
  { employeeId: "E-521", name: "Divya Nair", department: "Finance", month: 2, year: 2026, investedCredits: 17000, savingsInr: 3900, roiPct: 129, topContributors: "Nutrition and follow-up" },
  { employeeId: "E-612", name: "Aman Kulkarni", department: "Engineering", month: 1, year: 2026, investedCredits: 25000, savingsInr: 6900, roiPct: 176, topContributors: "Teleconsult and meds" },
  { employeeId: "E-804", name: "Karan Bedi", department: "Operations", month: 1, year: 2026, investedCredits: 22000, savingsInr: 5800, roiPct: 163, topContributors: "Sleep and preventive care" },
];

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function SavingsPage() {
  const [range, setRange] = useState<AnalysisRange>("Month");
  const [scenarioHeadcount, setScenarioHeadcount] = useState(2600);
  const [scenarioAdoption, setScenarioAdoption] = useState(78);
  const [scenarioAvgSavings, setScenarioAvgSavings] = useState(2400);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportMonth, setExportMonth] = useState(2);
  const [exportYear, setExportYear] = useState(2026);
  const [exportStatus, setExportStatus] = useState("");

  const model = useMemo(() => {
    const enrolled = Math.round((scenarioHeadcount * scenarioAdoption) / 100);
    const annualGross = enrolled * scenarioAvgSavings;
    const annualProgramCost = Math.round(annualGross * 0.29);
    const annualNet = annualGross - annualProgramCost;
    const roi = annualProgramCost > 0 ? Math.round((annualNet / annualProgramCost) * 100) : 0;
    return { enrolled, annualGross, annualProgramCost, annualNet, roi };
  }, [scenarioHeadcount, scenarioAdoption, scenarioAvgSavings]);

  const employeeRows = useMemo(() => {
    if (range === "Year") return employeeSavingsData.filter((item) => item.year === exportYear);
    if (range === "Week") return employeeSavingsData.filter((item) => item.month === exportMonth + 1 && item.year === exportYear).slice(0, 4);
    return employeeSavingsData.filter((item) => item.month === exportMonth + 1 && item.year === exportYear);
  }, [range, exportMonth, exportYear]);

  const employeeTotals = useMemo(() => {
    const investedCredits = employeeRows.reduce((sum, item) => sum + item.investedCredits, 0);
    const investedInr = Math.round(investedCredits / 10);
    const savingsInr = employeeRows.reduce((sum, item) => sum + item.savingsInr, 0);
    const roi = investedInr > 0 ? Math.round(((savingsInr - investedInr) / investedInr) * 100) : 0;
    return { investedCredits, investedInr, savingsInr, roi };
  }, [employeeRows]);

  const exportYearOptions = [2024, 2025, 2026, 2027];

  function exportSavingsReport() {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    let y = 46;
    const line = 18;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Savings & ROI Report", 40, y);
    y += line;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Period: ${monthNames[exportMonth]} ${exportYear} (${range})`, 40, y);
    y += line;
    doc.text(`Generated: ${new Date().toLocaleString()}`, 40, y);
    y += line * 1.4;

    doc.setFont("helvetica", "bold");
    doc.text("Summary", 40, y);
    y += line;
    doc.setFont("helvetica", "normal");
    doc.text(`Invested credits: ${employeeTotals.investedCredits.toLocaleString("en-IN")}`, 40, y);
    y += line;
    doc.text(`Invested amount: INR ${employeeTotals.investedInr.toLocaleString("en-IN")}`, 40, y);
    y += line;
    doc.text(`Savings generated: INR ${employeeTotals.savingsInr.toLocaleString("en-IN")}`, 40, y);
    y += line;
    doc.text(`Net ROI: ${employeeTotals.roi}%`, 40, y);
    y += line * 1.5;

    doc.setFont("helvetica", "bold");
    doc.text("Employee-level ROI", 40, y);
    y += line;
    doc.setFont("helvetica", "normal");
    if (!employeeRows.length) {
      doc.text("No employee savings data available for selected period.", 40, y);
    } else {
      employeeRows.forEach((row) => {
        doc.text(
          `${row.employeeId} | ${row.name} | Credits ${row.investedCredits.toLocaleString("en-IN")} | Savings INR ${row.savingsInr.toLocaleString("en-IN")} | ROI ${row.roiPct}%`,
          40,
          y
        );
        y += line;
      });
    }

    const monthNumber = String(exportMonth + 1).padStart(2, "0");
    doc.save(`savings-roi-${exportYear}-${monthNumber}.pdf`);
    setExportModalOpen(false);
    setExportStatus(`Exported savings ROI report for ${monthNames[exportMonth]} ${exportYear}.`);
  }

  return (
    <div className="page page-savings">
      <SectionTitle
        title="Savings & ROI"
        subtitle={`Finance-grade wellness savings intelligence (${range} analysis)`}
        action={<button className="ghost-btn" onClick={() => setExportModalOpen(true)}><ArrowDownToLine size={14} />Export</button>}
      />
      <AnalysisRangeBar value={range} onChange={setRange} />
      {exportStatus ? <p className="export-status">{exportStatus}</p> : null}

      <div className="grid cols-4">
        <StatCard title="This Month Saved" subtitle="Net savings vs traditional pathway" value="INR 63.2L" delta="Strong performance" icon={<Sparkles size={16} />} />
        <StatCard title="Projected Annual Savings" subtitle="Current run-rate forecast" value="INR 7.2Cr" delta="Growing +18% YoY" icon={<ChartNoAxesColumnIncreasing size={16} />} />
        <StatCard title="Return on Investment" subtitle="Portfolio-level ROI" value="324%" delta="Cost recovered 3.24x" icon={<BadgeIndianRupee size={16} />} />
        <StatCard title="Cost per Employee" subtitle="Annualized adjusted spend" value="INR 14,166" delta="Down by 12%" icon={<WalletCards size={16} />} />
      </div>

      <div className="grid cols-2-big">
        <section className="card panel">
          <h2>Where Savings Come From</h2>
          <p className="muted">Unique source breakdown from actual utilization signals.</p>
          <SavingsBreakdownPie />
          <div className="highlight-strip"><strong>Total Monthly Savings INR 56.5L | Projected Annual INR 6.8Cr</strong></div>
        </section>

        <section className="card panel">
          <h2>Cost Comparison: Traditional vs Wellness Program</h2>
          <SavingsCompareChart />
          <div className="highlight-strip"><strong>Estimated cost avoidance ratio: 1.9x</strong></div>
        </section>
      </div>

      <section className="card panel">
        <h2>Department-Wise ROI</h2>
        <div className="savings-grid">
          <div className="savings-grid-head">
            <span>Department</span>
            <span>Employees</span>
            <span>Program Cost</span>
            <span>Savings</span>
            <span>ROI</span>
            <span>Risk Reduction</span>
          </div>
          {departmentRoiData.map((row) => (
            <div className="savings-grid-row" key={row.department}>
              <strong>{row.department}</strong>
              <span>{row.employees}</span>
              <span>INR {row.programCostL}L</span>
              <span>INR {row.savingsL}L</span>
              <span className="savings-pos">{row.roiPct}%</span>
              <span>{row.riskReductionPct}%</span>
            </div>
          ))}
        </div>
      </section>

      <section className="card panel">
        <h2>Employee-Wise Savings ROI Detail</h2>
        <div className="employee-roi-grid">
          <div className="employee-roi-head">
            <span>Employee</span>
            <span>Department</span>
            <span>Invested Credits</span>
            <span>Investment (INR)</span>
            <span>Savings (INR)</span>
            <span>ROI</span>
            <span>Top Contributors</span>
          </div>
          {employeeRows.length === 0 ? (
            <div className="employee-roi-empty">No employee ROI data for selected period.</div>
          ) : (
            employeeRows.map((row) => (
              <div className="employee-roi-row" key={row.employeeId}>
                <div>
                  <strong>{row.name}</strong>
                  <small>{row.employeeId}</small>
                </div>
                <span>{row.department}</span>
                <strong>{row.investedCredits.toLocaleString("en-IN")}</strong>
                <span>INR {Math.round(row.investedCredits / 10).toLocaleString("en-IN")}</span>
                <span>INR {row.savingsInr.toLocaleString("en-IN")}</span>
                <span className={row.roiPct >= 150 ? "savings-pos" : ""}>{row.roiPct}%</span>
                <span>{row.topContributors}</span>
              </div>
            ))
          )}
        </div>
        <div className="highlight-strip"><strong>Period totals: Invested INR {employeeTotals.investedInr.toLocaleString("en-IN")} | Saved INR {employeeTotals.savingsInr.toLocaleString("en-IN")} | ROI {employeeTotals.roi}%</strong></div>
      </section>

      <section className="card panel">
        <h2>Quarterly Net Savings Runway</h2>
        {quarterlyNetSavings.map((item) => (
          <div className="hbar" key={item.quarter}>
            <span>{item.quarter}</span>
            <div>
              <i style={{ width: `${item.progress}%` }} />
              <b>INR {item.netL}L</b>
            </div>
          </div>
        ))}
      </section>

      <section className="card panel">
        <h2>Savings Scenario Simulator</h2>
        <p className="muted">Model the impact of participation and per-employee savings assumptions.</p>
        <div className="savings-simulator-grid">
          <label>
            Workforce Headcount
            <input className="input" type="number" value={scenarioHeadcount} onChange={(e) => setScenarioHeadcount(Number(e.target.value) || 0)} />
          </label>
          <label>
            Program Adoption (%)
            <input className="input" type="number" value={scenarioAdoption} onChange={(e) => setScenarioAdoption(Number(e.target.value) || 0)} />
          </label>
          <label>
            Avg Annual Savings per Enrolled Employee (INR)
            <input className="input" type="number" value={scenarioAvgSavings} onChange={(e) => setScenarioAvgSavings(Number(e.target.value) || 0)} />
          </label>
        </div>
        <div className="grid cols-4">
          <article className="soft-card">
            <strong>{model.enrolled.toLocaleString("en-IN")}</strong>
            <span>Estimated enrolled employees</span>
          </article>
          <article className="soft-card">
            <strong>INR {model.annualGross.toLocaleString("en-IN")}</strong>
            <span>Estimated annual gross savings</span>
          </article>
          <article className="soft-card">
            <strong>INR {model.annualProgramCost.toLocaleString("en-IN")}</strong>
            <span>Estimated annual program cost</span>
          </article>
          <article className="soft-card">
            <strong>{model.roi}%</strong>
            <span>Estimated ROI</span>
          </article>
        </div>
        <div className="highlight-strip"><strong>Estimated annual net savings: INR {model.annualNet.toLocaleString("en-IN")}</strong></div>
        <ProgressBar value={Math.min(100, Math.max(0, model.roi / 4))} />
      </section>

      {exportModalOpen && (
        <div className="export-modal-overlay" role="dialog" aria-modal="true">
          <section className="export-modal-card">
            <h3>Export Savings & ROI (PDF)</h3>
            <p>Select period for employee-level savings report.</p>
            <label>
              Month
              <select className="input" value={exportMonth} onChange={(event) => setExportMonth(Number(event.target.value))}>
                {monthNames.map((name, index) => (
                  <option key={name} value={index}>{name}</option>
                ))}
              </select>
            </label>
            <label>
              Year
              <select className="input" value={exportYear} onChange={(event) => setExportYear(Number(event.target.value))}>
                {exportYearOptions.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </label>
            <div className="export-modal-actions">
              <button className="ghost-btn" onClick={() => setExportModalOpen(false)}>Cancel</button>
              <button className="primary-btn" onClick={exportSavingsReport}>Export PDF</button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}


