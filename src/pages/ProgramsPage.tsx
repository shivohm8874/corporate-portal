import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, MapPin, Target, UsersRound, ChartNoAxesColumnIncreasing } from "lucide-react";
import { AnalysisRangeBar, ProgressBar, SectionTitle, StatCard } from "../components/ui";
import type { AnalysisRange } from "../components/ui";

type ProgramType = "Fitness Challenge" | "Mental Health Program" | "Wellness Camp";
type DeliveryMode = "Onsite Camp" | "Virtual" | "Hybrid";
type ProgramStatus = "Draft" | "Open Enrollment" | "Live" | "Completed";

type HealthProgram = {
  id: string;
  title: string;
  type: ProgramType;
  mode: DeliveryMode;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  capacity: number;
  status: ProgramStatus;
  createdBy: string;
};

type EnrollmentMap = Record<string, { seats: number; enrolledAt: string }>;

const PROGRAM_STORAGE_KEY = "astikan_health_programs_v1";
const ENROLL_STORAGE_KEY = "astikan_corporate_program_enrollments_v1";

const fallbackPrograms: HealthProgram[] = [
  {
    id: "prog-fallback-1",
    title: "FitSprint 30",
    type: "Fitness Challenge",
    mode: "Hybrid",
    description: "30-day team challenge for movement and consistency.",
    startDate: "2026-03-10",
    endDate: "2026-04-09",
    location: "Pan India",
    capacity: 2500,
    status: "Open Enrollment",
    createdBy: "Super Admin",
  },
  {
    id: "prog-fallback-2",
    title: "MindEase Circle",
    type: "Mental Health Program",
    mode: "Virtual",
    description: "Guided therapy and resilience routines for employees.",
    startDate: "2026-03-15",
    endDate: "2026-05-15",
    location: "Virtual Cohort",
    capacity: 1200,
    status: "Open Enrollment",
    createdBy: "Super Admin",
  },
];

function loadPrograms() {
  try {
    const raw = window.localStorage.getItem(PROGRAM_STORAGE_KEY);
    if (!raw) return fallbackPrograms;
    const parsed = JSON.parse(raw) as HealthProgram[];
    return Array.isArray(parsed) && parsed.length ? parsed : fallbackPrograms;
  } catch {
    return fallbackPrograms;
  }
}

function loadEnrollments() {
  try {
    const raw = window.localStorage.getItem(ENROLL_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as EnrollmentMap;
  } catch {
    return {};
  }
}

export function ProgramsPage() {
  const [range, setRange] = useState<AnalysisRange>("Month");
  const [programs, setPrograms] = useState<HealthProgram[]>([]);
  const [enrollments, setEnrollments] = useState<EnrollmentMap>({});
  const [typeFilter, setTypeFilter] = useState<"All" | ProgramType>("All");
  const [modeFilter, setModeFilter] = useState<"All" | DeliveryMode>("All");
  const [seatInputs, setSeatInputs] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setPrograms(loadPrograms());
    setEnrollments(loadEnrollments());
  }, []);

  useEffect(() => {
    window.localStorage.setItem(ENROLL_STORAGE_KEY, JSON.stringify(enrollments));
  }, [enrollments]);

  const visiblePrograms = useMemo(() => {
    return programs.filter((program) => {
      const matchType = typeFilter === "All" || program.type === typeFilter;
      const matchMode = modeFilter === "All" || program.mode === modeFilter;
      return matchType && matchMode && (program.status === "Open Enrollment" || program.status === "Live");
    });
  }, [programs, typeFilter, modeFilter]);

  const totalParticipants = useMemo(
    () => Object.values(enrollments).reduce((sum, item) => sum + item.seats, 0),
    [enrollments]
  );

  const activePrograms = visiblePrograms.length;
  const avgCompletion = 66.2;
  const avgDropOff = 10.9;

  function enrollProgram(program: HealthProgram) {
    const seats = Number(seatInputs[program.id] || 0);
    if (!seats || seats <= 0) {
      setNotice(`Enter valid seats to enroll in ${program.title}.`);
      return;
    }
    if (seats > program.capacity) {
      setNotice(`Seats exceed capacity for ${program.title}.`);
      return;
    }
    setEnrollments((prev) => ({
      ...prev,
      [program.id]: {
        seats,
        enrolledAt: new Date().toISOString(),
      },
    }));
    setNotice(`Enrollment submitted for ${program.title} (${seats} seats).`);
  }

  return (
    <div className="page page-programs">
      <SectionTitle title="Health Programs" subtitle={`Enroll employees in super admin created programs (${range} analysis)`} />
      <AnalysisRangeBar value={range} onChange={setRange} />

      <div className="grid cols-4">
        <StatCard title="Active Programs" subtitle="Open/live programs" value={String(activePrograms)} delta="+1 started this month" icon={<Target size={16} />} />
        <StatCard title="Total Enrolled Seats" subtitle="Across selected programs" value={String(totalParticipants)} delta="Corporate enrollment count" icon={<UsersRound size={16} />} />
        <StatCard title="Avg Completion" subtitle="Program completion benchmark" value={`${avgCompletion}%`} delta="+5.4% monthly" icon={<ChartNoAxesColumnIncreasing size={16} />} />
        <StatCard title="Avg Drop-off" subtitle="Disengagement risk" value={`${avgDropOff}%`} delta="-2.2% monthly" icon={<AlertTriangle size={16} />} />
      </div>

      <section className="card panel">
        <div className="program-filter-row">
          <label>
            Program Type
            <select className="input" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as "All" | ProgramType)}>
              <option value="All">All</option>
              <option value="Fitness Challenge">Fitness Challenge</option>
              <option value="Mental Health Program">Mental Health Program</option>
              <option value="Wellness Camp">Wellness Camp</option>
            </select>
          </label>
          <label>
            Delivery / Camp Mode
            <select className="input" value={modeFilter} onChange={(event) => setModeFilter(event.target.value as "All" | DeliveryMode)}>
              <option value="All">All</option>
              <option value="Onsite Camp">Onsite Camp</option>
              <option value="Virtual">Virtual</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </label>
        </div>
      </section>

      <section className="card panel">
        <h2>Available Programs (Created by Super Admin)</h2>
        {visiblePrograms.map((program) => {
          const enrolled = enrollments[program.id];
          const seats = Number(seatInputs[program.id] || enrolled?.seats || 0);
          const utilization = program.capacity > 0 ? Math.min((seats / program.capacity) * 100, 100) : 0;

          return (
            <article className="program-row" key={program.id}>
              <div className="row-bet">
                <div>
                  <h4>{program.title}</h4>
                  <small>{program.type} • {program.mode}</small>
                </div>
                <span className={`chip ${enrolled ? "chip-green" : "chip-info"}`}>
                  {enrolled ? "Enrolled" : "Open"}
                </span>
              </div>
              <p className="muted">{program.description}</p>
              <div className="row-bet">
                <small><MapPin size={13} /> {program.location}</small>
                <small>{program.startDate} to {program.endDate}</small>
              </div>
              <div className="program-enroll-row">
                <label>
                  Seats to enroll
                  <input
                    className="input"
                    type="number"
                    value={seatInputs[program.id] ?? (enrolled?.seats ? String(enrolled.seats) : "")}
                    onChange={(event) =>
                      setSeatInputs((prev) => ({ ...prev, [program.id]: event.target.value }))
                    }
                    placeholder={`Max ${program.capacity}`}
                  />
                </label>
                <button className="primary-btn" onClick={() => enrollProgram(program)}>
                  {enrolled ? "Update Enrollment" : "Enroll Program"}
                </button>
              </div>
              <small>Capacity used by your org request: {seats || 0} / {program.capacity}</small>
              <ProgressBar value={utilization} />
            </article>
          );
        })}
        {!visiblePrograms.length && <p className="muted">No programs available for selected filters.</p>}
        {notice ? <p className="program-notice">{notice}</p> : null}
      </section>
    </div>
  );
}
