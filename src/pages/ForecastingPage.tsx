import { useMemo, useState } from "react";
import { AlertTriangle, Brain, HeartPulse, ShieldAlert, Sparkles } from "lucide-react";
import { LineTrendChart } from "../components/charts";
import { AnalysisRangeBar, SectionTitle, StatCard } from "../components/ui";
import type { AnalysisRange } from "../components/ui";

type DepartmentForecast = {
  department: "Engineering" | "Sales" | "Operations" | "Finance" | "HR";
  headcount: number;
  predictedRiskPct: number;
  stressDropIfProgramPct: number;
  expectedAbsenteeismChangePct: number;
  confidence: number;
};

const forecastBase: DepartmentForecast[] = [
  { department: "Engineering", headcount: 920, predictedRiskPct: 17, stressDropIfProgramPct: 9, expectedAbsenteeismChangePct: -11, confidence: 88 },
  { department: "Sales", headcount: 620, predictedRiskPct: 22, stressDropIfProgramPct: 12, expectedAbsenteeismChangePct: -14, confidence: 84 },
  { department: "Operations", headcount: 540, predictedRiskPct: 19, stressDropIfProgramPct: 10, expectedAbsenteeismChangePct: -12, confidence: 86 },
  { department: "Finance", headcount: 280, predictedRiskPct: 14, stressDropIfProgramPct: 7, expectedAbsenteeismChangePct: -8, confidence: 82 },
  { department: "HR", headcount: 240, predictedRiskPct: 13, stressDropIfProgramPct: 6, expectedAbsenteeismChangePct: -7, confidence: 80 },
];

const factorByRange: Record<AnalysisRange, number> = {
  Week: 0.34,
  Month: 1,
  Year: 2.4,
};

export function ForecastingPage() {
  const [range, setRange] = useState<AnalysisRange>("Month");
  const [interventionBoost, setInterventionBoost] = useState(10);
  const [adoptionRate, setAdoptionRate] = useState(72);

  const factor = factorByRange[range];

  const forecastRows = useMemo(() => {
    return forecastBase.map((item) => {
      const adjustedRisk = Math.min(100, Math.round(item.predictedRiskPct * factor));
      const adjustedStressDrop = Math.round(item.stressDropIfProgramPct * (interventionBoost / 10) * (adoptionRate / 100));
      const adjustedAbsenteeism = Math.round(item.expectedAbsenteeismChangePct * (adoptionRate / 100));
      return {
        ...item,
        adjustedRisk,
        adjustedStressDrop,
        adjustedAbsenteeism,
      };
    });
  }, [factor, interventionBoost, adoptionRate]);

  const totals = useMemo(() => {
    const totalHeadcount = forecastRows.reduce((sum, item) => sum + item.headcount, 0);
    const weightedRisk = Math.round(
      forecastRows.reduce((sum, item) => sum + item.adjustedRisk * item.headcount, 0) / Math.max(totalHeadcount, 1)
    );
    const atRisk = Math.round((totalHeadcount * weightedRisk) / 100);
    const projectedCostSavedL = Math.round((atRisk * 0.18 * 0.55 * (range === "Year" ? 12 : range === "Week" ? 0.25 : 1)) * 100) / 100;
    const weightedConfidence = Math.round(
      forecastRows.reduce((sum, item) => sum + item.confidence * item.headcount, 0) / Math.max(totalHeadcount, 1)
    );
    return { totalHeadcount, weightedRisk, atRisk, projectedCostSavedL, weightedConfidence };
  }, [forecastRows, range]);

  return (
    <div className="page page-forecasting">
      <SectionTitle
        title="Health Forecast"
        subtitle={`Predictive analytics for risk, absenteeism, and savings impact (${range} analysis)`}
      />
      <AnalysisRangeBar value={range} onChange={setRange} />

      <div className="grid cols-4">
        <StatCard
          title="Predicted Healthy Employees"
          subtitle="Expected to stay in low-risk cohort"
          value={`${(totals.totalHeadcount - totals.atRisk).toLocaleString("en-IN")}`}
          delta="Model driven estimate"
          icon={<HeartPulse size={16} />}
          tone="success"
        />
        <StatCard
          title="At-Risk Cluster"
          subtitle="Needs proactive intervention"
          value={`${totals.atRisk.toLocaleString("en-IN")}`}
          delta="Sleep and stress dominant"
          icon={<ShieldAlert size={16} />}
          tone="warning"
          deltaTone="negative"
        />
        <StatCard
          title="Projected Cost Saved"
          subtitle="Through predicted risk reduction"
          value={`₹${totals.projectedCostSavedL.toLocaleString("en-IN")}L`}
          delta="Assuming current execution"
          icon={<Sparkles size={16} />}
          tone="brand"
        />
        <StatCard
          title="Model Confidence"
          subtitle="Weighted by payroll coverage"
          value={`${totals.weightedConfidence}%`}
          delta="Good confidence range"
          icon={<Brain size={16} />}
          tone="info"
        />
      </div>

      <div className="grid cols-2-big">
        <section className="card panel">
          <h2>Forecast Trajectory</h2>
          <p className="muted">Expected risk trajectory under current policy and participation.</p>
          <LineTrendChart color="var(--blue)" />
        </section>
        <section className="card panel">
          <h2>Intervention Simulator</h2>
          <p className="muted">Tune intervention intensity and participation to see forecast shift.</p>
          <div className="forecast-sim-grid">
            <label>
              Intervention Intensity ({interventionBoost}/20)
              <input
                className="input"
                type="range"
                min={5}
                max={20}
                value={interventionBoost}
                onChange={(event) => setInterventionBoost(Number(event.target.value))}
              />
            </label>
            <label>
              Adoption Rate ({adoptionRate}%)
              <input
                className="input"
                type="range"
                min={35}
                max={95}
                value={adoptionRate}
                onChange={(event) => setAdoptionRate(Number(event.target.value))}
              />
            </label>
          </div>
          <div className="highlight-strip">
            <strong>
              Expected risk reduction: {Math.max(4, Math.round((interventionBoost * adoptionRate) / 25))}% | Absenteeism impact: {Math.max(2, Math.round((interventionBoost * adoptionRate) / 40))}% down
            </strong>
          </div>
        </section>
      </div>

      <section className="card panel">
        <h2>Department Forecast Matrix</h2>
        <div className="forecast-grid">
          <div className="forecast-grid-head">
            <span>Department</span>
            <span>Headcount</span>
            <span>Predicted Risk</span>
            <span>Stress Drop (if program)</span>
            <span>Absenteeism Change</span>
            <span>Confidence</span>
          </div>
          {forecastRows.map((row) => (
            <div className="forecast-grid-row" key={row.department}>
              <strong>{row.department}</strong>
              <span>{row.headcount}</span>
              <span className={row.adjustedRisk >= 20 ? "forecast-risk high" : row.adjustedRisk >= 15 ? "forecast-risk medium" : "forecast-risk low"}>
                {row.adjustedRisk}%
              </span>
              <span>{row.adjustedStressDrop}%</span>
              <span>{row.adjustedAbsenteeism}%</span>
              <span>{row.confidence}%</span>
            </div>
          ))}
        </div>
      </section>

      <section className="card panel">
        <div className="panel-head">
          <h2>Recommended Actions</h2>
          <span className="chip chip-warning"><AlertTriangle size={12} /> Auto-generated</span>
        </div>
        <div className="grid cols-3">
          <article className="soft-card">
            <strong>Sales + Engineering stress wave</strong>
            <span>Run mental resilience cohort and manager check-ins for 8 weeks.</span>
          </article>
          <article className="soft-card">
            <strong>Sleep-risk cluster</strong>
            <span>Launch sleep program and nudge late-shift teams for recovery protocol.</span>
          </article>
          <article className="soft-card">
            <strong>Preventive screening trigger</strong>
            <span>Schedule high-risk cohort screening before next cycle to avoid claim spikes.</span>
          </article>
        </div>
      </section>
    </div>
  );
}
