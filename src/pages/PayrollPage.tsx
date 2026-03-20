import { useEffect, useMemo, useRef, useState } from "react"
import { AlertTriangle, CircleX, RefreshCw, UsersRound, Workflow, Clock3, UploadCloud } from "lucide-react"
import { SectionTitle, StatCard } from "../components/ui"
import { getCorporateSession } from "../services/authApi"
import {
  connectIntegration,
  disconnectIntegration,
  fetchPayrollInsuranceState,
  fetchPayrollEmployees,
  retryPayrollEmployee,
  syncIntegration,
  uploadPayrollFile,
  uploadPayrollEmployees,
  type IntegrationState,
  type IntegrationSummary,
} from "../services/integrationApi"
import Papa from "papaparse"
import * as XLSX from "xlsx"

const emptyState: IntegrationState = {
  companyId: "",
  payroll: { connected: [], available: [], inbuiltEnabled: false, uploads: [] },
  insurance: { connected: [], available: [] },
  lastSyncAt: null,
  failedSyncs24h: 0,
}

export function PayrollPage() {
  const session = getCorporateSession()
  const companyId = session?.companyId ?? ""
  const [activity, setActivity] = useState("Loading integrations...")
  const [state, setState] = useState<IntegrationState>(emptyState)
  const [summary, setSummary] = useState<IntegrationSummary>({
    connectedSystems: 0,
    syncedEmployees: 0,
    failedSyncs: 0,
    lastSync: null,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [employeeRows, setEmployeeRows] = useState<Array<{ employeeId: string; fullName?: string; department?: string; email?: string; status: string; lastSyncAt?: string }>>([])
  const [employeeStats, setEmployeeStats] = useState<{ total: number; synced: number; pending: number; failed: number }>({
    total: 0,
    synced: 0,
    pending: 0,
    failed: 0,
  })
  const [previewRows, setPreviewRows] = useState<Array<{ employeeId: string; fullName?: string; department?: string; email?: string }>>([])
  const [previewFilename, setPreviewFilename] = useState("")
  const uploadRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!companyId) return
    let active = true
    const load = async () => {
      setLoading(true)
      setError("")
      try {
        const data = await fetchPayrollInsuranceState(companyId)
        if (!active) return
        setState(data.state)
        setSummary(data.summary)
        setActivity(
          data.state.payroll.connected.length === 0 && !data.state.payroll.inbuiltEnabled
            ? "Payroll not connected yet. Choose an integration or use Astikan Payroll."
            : "Payroll & insurance integrations are up to date.",
        )
      } catch (err) {
        if (!active) return
        setError(err instanceof Error ? err.message : "Unable to load integrations")
        setActivity("Unable to load integrations. Please retry.")
      } finally {
        if (active) setLoading(false)
      }
    }
    void load()
    return () => {
      active = false
    }
  }, [companyId])

  useEffect(() => {
    if (!companyId) return
    let active = true
    const loadEmployees = async () => {
      try {
        const data = await fetchPayrollEmployees(companyId, 60)
        if (!active) return
        setEmployeeRows(data.rows ?? [])
        setEmployeeStats(data.stats ?? { total: 0, synced: 0, pending: 0, failed: 0 })
      } catch {
        // ignore
      }
    }
    void loadEmployees()
    const interval = window.setInterval(loadEmployees, 10000)
    return () => {
      active = false
      window.clearInterval(interval)
    }
  }, [companyId])

  const mappedEmployees = useMemo(() => summary.syncedEmployees.toLocaleString("en-IN"), [summary.syncedEmployees])

  async function handleConnect(type: "payroll" | "insurance", name: string) {
    if (!companyId) return
    try {
      const data = await connectIntegration({ companyId, type, name, mode: "provider" })
      setState(data.state)
      setSummary(data.summary)
      setActivity(`${name} connected successfully. Sync onboarding started.`)
    } catch (err) {
      setActivity(err instanceof Error ? err.message : "Unable to connect integration.")
    }
  }

  async function handleEnableInbuilt() {
    if (!companyId) return
    try {
      const data = await connectIntegration({ companyId, type: "payroll", mode: "inbuilt" })
      setState(data.state)
      setSummary(data.summary)
      setActivity("Astikan Payroll activated. You can bulk upload employees or configure rules.")
    } catch (err) {
      setActivity(err instanceof Error ? err.message : "Unable to enable inbuilt payroll.")
    }
  }

  async function handleSync(type: "payroll" | "insurance", name: string) {
    if (!companyId) return
    try {
      const data = await syncIntegration({ companyId, type, name })
      setState(data.state)
      setSummary(data.summary)
      setActivity(`${name} sync queued. Updates will appear within a few minutes.`)
    } catch (err) {
      setActivity(err instanceof Error ? err.message : "Unable to sync integration.")
    }
  }

  async function handleDisconnect(type: "payroll" | "insurance", name: string) {
    if (!companyId) return
    try {
      const data = await disconnectIntegration({ companyId, type, name })
      setState(data.state)
      setSummary(data.summary)
      setActivity(`${name} disconnect requested. Access is being revoked.`)
    } catch (err) {
      setActivity(err instanceof Error ? err.message : "Unable to disconnect integration.")
    }
  }

  async function handleUpload(file?: File | null) {
    if (!companyId || !file) return
    try {
      const ext = file.name.split(".").pop()?.toLowerCase()
      let employees: Array<{ employeeId: string; fullName?: string; department?: string; email?: string }> = []
      if (ext === "csv") {
        const text = await file.text()
        const parsed = Papa.parse<Record<string, string>>(text, { header: true, skipEmptyLines: true })
        employees = (parsed.data || [])
          .map((row, index) => ({
            employeeId: row.employee_id || row.employeeId || row.id || `EMP-${index + 1}`,
            fullName: row.name || row.fullName || row.employee_name || "Employee",
            department: row.department || row.team || "General",
            email: row.email,
          }))
          .filter((row) => row.employeeId)
      } else if (ext === "xls" || ext === "xlsx") {
        const buffer = await file.arrayBuffer()
        const workbook = XLSX.read(buffer, { type: "array" })
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]
        const json = XLSX.utils.sheet_to_json<Record<string, string>>(sheet)
        employees = json.map((row, index) => ({
          employeeId: row.employee_id || row.employeeId || row.id || `EMP-${index + 1}`,
          fullName: row.name || row.fullName || row.employee_name || "Employee",
          department: row.department || row.team || "General",
          email: row.email,
        }))
      }

      setPreviewRows(employees.slice(0, 8))
      setPreviewFilename(file.name)
      const data = employees.length
        ? await uploadPayrollEmployees({ companyId, filename: file.name, rows: employees.length, employees })
        : await uploadPayrollFile({ companyId, filename: file.name, rows: 0 })

      setState(data.state)
      setSummary(data.summary)
      setActivity(`Payroll upload received: ${file.name}. Parsed ${employees.length || 0} employees.`)
    } catch (err) {
      setActivity(err instanceof Error ? err.message : "Unable to upload payroll file.")
    }
  }

  function exportFailedCsv() {
    const failed = employeeRows.filter((row) => row.status === "Failed")
    if (failed.length === 0) return
    const header = ["employeeId", "name", "department", "email", "status"]
    const lines = failed.map((row) =>
      [row.employeeId, row.fullName ?? "", row.department ?? "", row.email ?? "", row.status].join(","),
    )
    const csv = [header.join(","), ...lines].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "failed-payroll-sync.csv"
    link.click()
  }

  return (
    <div className="page page-payroll">
      <SectionTitle
        title="Payroll & Insurance Integrations"
        subtitle="Connect payroll and group insurance systems to sync employee mapping, billing and ROI"
        action={<button className="primary-btn">+ Add Integration</button>}
      />
      <div className="grid cols-4">
        <StatCard title="Connected Systems" subtitle="Current integrations" value={String(summary.connectedSystems)} delta="Active channels" icon={<Workflow size={16} />} />
        <StatCard title="Total Synced Employees" subtitle="Across payroll + insurance" value={mappedEmployees} delta="Auto-refresh" icon={<UsersRound size={16} />} />
        <StatCard title="Failed Syncs (24h)" subtitle="Needs attention" value={String(summary.failedSyncs)} delta="API/auth failures" icon={<AlertTriangle size={16} />} />
        <StatCard title="Last Sync" subtitle="Most recent update" value={summary.lastSync ? new Date(summary.lastSync).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }) : "—"} delta="Realtime mode" icon={<Clock3 size={16} />} />
      </div>

      <p className="workforce-subline">{loading ? "Loading integrations..." : activity}</p>
      {error && <p className="workforce-subline" style={{ color: "#b4232f" }}>{error}</p>}

      <section className="card panel">
        <h2>Connected Payroll Systems</h2>
        {state.payroll.connected.length === 0 && !state.payroll.inbuiltEnabled && (
          <article className="soft-card">
            <strong>No payroll connected yet</strong>
            <p className="muted">Choose an integration or start with Astikan Payroll (free).</p>
            <div className="row-gap">
              <button className="ghost-btn" onClick={handleEnableInbuilt}>Enable Astikan Payroll</button>
              <button className="ghost-btn" onClick={() => uploadRef.current?.click()}><UploadCloud size={14} /> Bulk upload</button>
            </div>
          </article>
        )}
        {state.payroll.inbuiltEnabled && (
          <article className="integration">
            <div>
              <h4>Astikan Payroll <span className="chip chip-green">Active</span></h4>
              <small>Inbuilt payroll • Configurable rules</small>
            </div>
            <div className="row-gap">
              <button className="ghost-btn" onClick={() => uploadRef.current?.click()}><UploadCloud size={14} /> Upload</button>
              <button className="link-btn" onClick={() => handleDisconnect("payroll", "inbuilt")}><CircleX size={14} /> Disable</button>
            </div>
          </article>
        )}
        {state.payroll.connected.map((s) => (
          <article className={`integration ${s.status === "Error" ? "integration-error" : ""}`} key={s.name}>
            <div>
              <h4>{s.name} <span className={`chip ${s.status === "Error" ? "chip-warning" : "chip-green"}`}>{s.status}</span></h4>
              <small>{s.employees.toLocaleString("en-IN")} employees • {s.cadence}</small>
            </div>
            <div className="row-gap">
              <button className="ghost-btn" onClick={() => handleSync("payroll", s.name)}><RefreshCw size={14} /> Sync now</button>
              <button className="link-btn" onClick={() => handleDisconnect("payroll", s.name)}><CircleX size={14} /> Disconnect</button>
            </div>
          </article>
        ))}
      </section>

      <section className="card panel">
        <h2>Available Payroll Integrations</h2>
        <div className="grid cols-3">
          {state.payroll.available.map((i) => (
            <article className="soft-card" key={i}>
              <strong>{i}</strong>
              <p className="muted">API requirements: client id, secret, org id, callback URL.</p>
              <button className="ghost-btn" onClick={() => handleConnect("payroll", i)}>Connect</button>
            </article>
          ))}
        </div>
        <input
          ref={uploadRef}
          type="file"
          accept=".csv,.xls,.xlsx"
          style={{ display: "none" }}
          onChange={(event) => handleUpload(event.target.files?.[0])}
        />
        {previewRows.length > 0 && (
          <div className="soft-card" style={{ marginTop: 16 }}>
            <strong>Upload Preview ({previewFilename})</strong>
            <div className="integration-table" style={{ marginTop: 12 }}>
              {previewRows.map((row) => (
                <article className="integration" key={row.employeeId}>
                  <div>
                    <h4>{row.fullName ?? "Employee"}</h4>
                    <small>{row.employeeId} • {row.department ?? "General"}</small>
                  </div>
                  <div className="row-gap">
                    <small>{row.email ?? "—"}</small>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
        {state.payroll.uploads && state.payroll.uploads.length > 0 && (
          <div className="soft-card" style={{ marginTop: 16 }}>
            <strong>Recent Uploads</strong>
            {state.payroll.uploads.map((u) => (
              <div key={u.filename} className="row-gap" style={{ justifyContent: "space-between", marginTop: 8 }}>
                <span>{u.filename}</span>
                <small>{new Date(u.uploadedAt).toLocaleString("en-IN", { hour: "numeric", minute: "2-digit" })}</small>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="card panel">
        <h2>Employee Sync Status</h2>
        <p className="muted">Live status updates every 10 seconds based on payroll sync runs.</p>
        <div className="grid cols-4" style={{ marginTop: 12 }}>
          <div className="soft-card"><strong>{employeeStats.total}</strong><small>Total employees</small></div>
          <div className="soft-card"><strong>{employeeStats.synced}</strong><small>Synced</small></div>
          <div className="soft-card"><strong>{employeeStats.pending}</strong><small>Pending</small></div>
          <div className="soft-card"><strong>{employeeStats.failed}</strong><small>Failed</small></div>
        </div>
        {employeeStats.failed > 0 && (
          <div className="row-gap" style={{ marginTop: 12 }}>
            <button className="ghost-btn" onClick={exportFailedCsv}>Export failed CSV</button>
          </div>
        )}
        <div className="integration-table" style={{ marginTop: 16 }}>
          {employeeRows.length === 0 && <p className="muted">No employee sync data yet. Upload a payroll file to start.</p>}
          {employeeRows.map((row) => (
            <article className={`integration ${row.status === "Failed" ? "integration-error" : ""}`} key={row.employeeId}>
              <div>
                <h4>{row.fullName ?? "Employee"} <span className={`chip ${row.status === "Failed" ? "chip-warning" : "chip-green"}`}>{row.status}</span></h4>
                <small>{row.employeeId} • {row.department ?? "General"}</small>
              </div>
              <div className="row-gap">
                <small>{row.lastSyncAt ? new Date(row.lastSyncAt).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }) : "—"}</small>
                {row.status === "Failed" && (
                  <button className="ghost-btn" onClick={() => retryPayrollEmployee(companyId, row.employeeId)}>
                    Retry
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="card panel">
        <h2>Connected Group Insurance</h2>
        {state.insurance.connected.length === 0 && (
          <article className="soft-card">
            <strong>No insurance connected yet</strong>
            <p className="muted">Connect your group insurance provider to sync eligibility and claims.</p>
          </article>
        )}
        {state.insurance.connected.map((s) => (
          <article className={`integration ${s.status === "Error" ? "integration-error" : ""}`} key={s.name}>
            <div>
              <h4>{s.name} <span className={`chip ${s.status === "Error" ? "chip-warning" : "chip-green"}`}>{s.status}</span></h4>
              <small>{s.employees.toLocaleString("en-IN")} covered employees • {s.cadence}</small>
            </div>
            <div className="row-gap">
              <button className="ghost-btn" onClick={() => handleSync("insurance", s.name)}><RefreshCw size={14} /> Sync now</button>
              <button className="link-btn" onClick={() => handleDisconnect("insurance", s.name)}><CircleX size={14} /> Disconnect</button>
            </div>
          </article>
        ))}
      </section>

      <section className="card panel">
        <h2>Available Group Insurance Integrations</h2>
        <p className="muted">Connect third-party insurers to sync group coverage and claims metadata.</p>
        <div className="grid cols-3">
          {state.insurance.available.map((name) => {
            const isConnected = state.insurance.connected.some((item) => item.name === name)
            return (
              <article className="soft-card" key={name}>
                <strong>{name}</strong>
                <button className="ghost-btn" onClick={() => handleConnect("insurance", name)} disabled={isConnected}>
                  {isConnected ? "Connected" : "Connect"}
                </button>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}
