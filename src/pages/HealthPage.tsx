import { useMemo, useState } from "react";
import { Activity, Brain, Heart, Search, ShieldAlert, Users } from "lucide-react";
import { LineTrendChart } from "../components/charts";
import { AnalysisRangeBar, SectionTitle, StatCard } from "../components/ui";
import type { AnalysisRange } from "../components/ui";

type RiskLevel = "low" | "medium" | "high";
type HealthCategory = "Cardio" | "Mental" | "Sleep" | "Metabolic" | "Mobility";

type EmployeeHealth = {
  id: string;
  name: string;
  department: "Engineering" | "Sales" | "HR" | "Operations" | "Finance";
  category: HealthCategory;
  healthScore: number;
  stressScore: number;
  sleepHours: number;
  risk: RiskLevel;
  trend: "improving" | "stable" | "declining";
};

const employees: EmployeeHealth[] = [
  { id: "E-102", name: "Priya Singh", department: "Engineering", category: "Mental", healthScore: 69, stressScore: 78, sleepHours: 5.8, risk: "high", trend: "declining" },
  { id: "E-229", name: "Rohan Mehta", department: "Sales", category: "Cardio", healthScore: 74, stressScore: 63, sleepHours: 6.3, risk: "medium", trend: "stable" },
  { id: "E-355", name: "Anita Verma", department: "HR", category: "Sleep", healthScore: 82, stressScore: 44, sleepHours: 7.1, risk: "low", trend: "improving" },
  { id: "E-498", name: "Sameer Rao", department: "Operations", category: "Metabolic", healthScore: 71, stressScore: 59, sleepHours: 6.2, risk: "medium", trend: "declining" },
  { id: "E-521", name: "Divya Nair", department: "Finance", category: "Mobility", healthScore: 79, stressScore: 48, sleepHours: 7.0, risk: "low", trend: "stable" },
  { id: "E-612", name: "Aman Kulkarni", department: "Engineering", category: "Cardio", healthScore: 66, stressScore: 72, sleepHours: 5.9, risk: "high", trend: "declining" },
  { id: "E-738", name: "Mitali Shah", department: "Sales", category: "Mental", healthScore: 76, stressScore: 58, sleepHours: 6.6, risk: "medium", trend: "improving" },
  { id: "E-804", name: "Karan Bedi", department: "Operations", category: "Sleep", healthScore: 73, stressScore: 61, sleepHours: 6.0, risk: "medium", trend: "stable" },
];

const categoryOrder: HealthCategory[] = ["Cardio", "Mental", "Sleep", "Metabolic", "Mobility"];

export function HealthPage() {
  const [range, setRange] = useState<AnalysisRange>("Month");
  const [departmentFilter, setDepartmentFilter] = useState<"All" | EmployeeHealth["department"]>("All");
  const [categoryFilter, setCategoryFilter] = useState<"All" | HealthCategory>("All");
  const [riskFilter, setRiskFilter] = useState<"all" | RiskLevel>("all");
  const [search, setSearch] = useState("");

  const filteredEmployees = useMemo(() => {
    const query = search.trim().toLowerCase();
    return employees.filter((employee) => {
      const matchDepartment = departmentFilter === "All" || employee.department === departmentFilter;
      const matchCategory = categoryFilter === "All" || employee.category === categoryFilter;
      const matchRisk = riskFilter === "all" || employee.risk === riskFilter;
      const matchSearch =
        !query ||
        employee.name.toLowerCase().includes(query) ||
        employee.id.toLowerCase().includes(query);
      return matchDepartment && matchCategory && matchRisk && matchSearch;
    });
  }, [departmentFilter, categoryFilter, riskFilter, search]);

  const kpis = useMemo(() => {
    const headcount = filteredEmployees.length || 1;
    const avgHealth = Math.round(filteredEmployees.reduce((sum, item) => sum + item.healthScore, 0) / headcount);
    const avgStress = Math.round(filteredEmployees.reduce((sum, item) => sum + item.stressScore, 0) / headcount);
    const avgSleep = Number((filteredEmployees.reduce((sum, item) => sum + item.sleepHours, 0) / headcount).toFixed(1));
    const highRisk = filteredEmployees.filter((item) => item.risk === "high").length;
    return { avgHealth, avgStress, avgSleep, highRisk };
  }, [filteredEmployees]);

  const categoryBreakdown = useMemo(() => {
    return categoryOrder.map((category) => {
      const rows = filteredEmployees.filter((item) => item.category === category);
      const count = rows.length;
      const avgScore = count ? Math.round(rows.reduce((sum, item) => sum + item.healthScore, 0) / count) : 0;
      const highRiskCount = rows.filter((item) => item.risk === "high").length;
      return { category, count, avgScore, highRiskCount };
    });
  }, [filteredEmployees]);

  const departments = useMemo(() => {
    return ["All", ...Array.from(new Set(employees.map((item) => item.department)))] as const;
  }, []);

  return (
    <div className="page page-health">
      <SectionTitle title="Health Insights" subtitle={`Employee-wise and category-wise health analytics (${range} analysis)`} />
      <AnalysisRangeBar value={range} onChange={setRange} />

      <div className="grid cols-4">
        <StatCard title="Average Health Score" subtitle="Filtered employee cohort" value={`${kpis.avgHealth}/100`} delta="+2 vs last cycle" icon={<Heart size={16} />} tone="success" />
        <StatCard title="Average Stress Score" subtitle="Higher means elevated stress" value={`${kpis.avgStress}/100`} delta={kpis.avgStress > 65 ? "Needs intervention" : "In control"} icon={<Brain size={16} />} tone="warning" />
        <StatCard title="Average Sleep Duration" subtitle="Daily average" value={`${kpis.avgSleep} hrs`} delta={kpis.avgSleep < 6.5 ? "Below target" : "Healthy"} icon={<Activity size={16} />} tone="info" />
        <StatCard title="High-Risk Employees" subtitle="Immediate care candidates" value={String(kpis.highRisk)} delta={kpis.highRisk > 2 ? "Escalate to HR + Medical" : "Within threshold"} icon={<ShieldAlert size={16} />} tone="danger" />
      </div>

      <section className="card panel">
        <div className="panel-head">
          <div>
            <h2>Cohort Filters</h2>
            <p className="muted">Slice insights by department, category, risk level, and employee.</p>
          </div>
          <span className="chip chip-info"><Users size={12} /> {filteredEmployees.length} Employees</span>
        </div>
        <div className="health-filter-grid">
          <label>
            Department
            <select className="input" value={departmentFilter} onChange={(event) => setDepartmentFilter(event.target.value as "All" | EmployeeHealth["department"])}>
              {departments.map((dept) => <option key={dept} value={dept}>{dept}</option>)}
            </select>
          </label>
          <label>
            Risk Segment
            <select className="input" value={riskFilter} onChange={(event) => setRiskFilter(event.target.value as "all" | RiskLevel)}>
              <option value="all">All</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>
          <label className="health-search">
            <Search size={15} />
            <input className="input" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search employee by name or ID" />
          </label>
        </div>

        <div className="health-category-row">
          <button className={`ghost-btn ${categoryFilter === "All" ? "tab-active" : ""}`} onClick={() => setCategoryFilter("All")}>All Categories</button>
          {categoryOrder.map((item) => (
            <button key={item} className={`ghost-btn ${categoryFilter === item ? "tab-active" : ""}`} onClick={() => setCategoryFilter(item)}>
              {item}
            </button>
          ))}
        </div>
      </section>

      <div className="grid cols-2-big">
        <section className="card panel">
          <h2>Health Trend (Cohort)</h2>
          <LineTrendChart />
        </section>
        <section className="card panel">
          <h2>Stress Trend (Cohort)</h2>
          <LineTrendChart color="var(--danger)" />
        </section>
      </div>

      <section className="card panel">
        <h2>Category-Wise Health Breakdown</h2>
        {categoryBreakdown.map((row) => (
          <div className="health-category-bar" key={row.category}>
            <div>
              <strong>{row.category}</strong>
              <small>{row.count} employees • {row.highRiskCount} high-risk</small>
            </div>
            <div>
              <i style={{ width: `${row.avgScore}%` }} />
              <b>{row.avgScore}/100</b>
            </div>
          </div>
        ))}
      </section>

      <section className="card panel">
        <h2>Employee Health Detail</h2>
        <div className="health-employee-grid">
          <div className="health-employee-head">
            <span>Employee</span>
            <span>Department</span>
            <span>Category</span>
            <span>Health</span>
            <span>Stress</span>
            <span>Sleep</span>
            <span>Risk</span>
            <span>Trend</span>
          </div>
          {filteredEmployees.length === 0 ? (
            <div className="health-employee-empty">No employees found for selected filters.</div>
          ) : (
            filteredEmployees.map((employee) => (
              <div className="health-employee-row" key={employee.id}>
                <div>
                  <strong>{employee.name}</strong>
                  <small>{employee.id}</small>
                </div>
                <span>{employee.department}</span>
                <span>{employee.category}</span>
                <strong>{employee.healthScore}</strong>
                <strong>{employee.stressScore}</strong>
                <span>{employee.sleepHours} hrs</span>
                <span className={`chip ${employee.risk === "high" ? "chip-danger" : employee.risk === "medium" ? "chip-warning" : "chip-green"}`}>
                  {employee.risk}
                </span>
                <span className={`health-trend ${employee.trend}`}>{employee.trend}</span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
