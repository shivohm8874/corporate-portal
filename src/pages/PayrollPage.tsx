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

type UploadRow = Record<string, string>

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
        const parsed = Papa.parse<UploadRow>(text, { header: true, skipEmptyLines: true })
        employees = (parsed.data || [])
          .map((row: UploadRow, index: number) => ({
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
        const json = XLSX.utils.sheet_to_json<UploadRow>(sheet)
        employees = json.map((row: UploadRow, index: number) => ({
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
      {loading ? (
        <div className="corp-loader-fullscreen">
          <div className="corp-spinner" />
          <span>Loading integrations...</span>
        </div>
      ) : null}
      <SectionTitle
        title="Payroll & Insurance Integrations"
        subtitle="Connect payroll and group insurance systems to sync employee mapping, billing and ROI."
        action={<button className="primary-btn">+ Add Integration</button>}
      />

      <div className="payroll-hero">
        <div>
          <h3>Integration Health</h3>
          <p>{loading ? "Loading integrations..." : activity}</p>
          {error && <p className="payroll-error">{error}</p>}
        </div>
        <div className="payroll-hero-grid">
          <StatCard title="Connected Systems" subtitle="Payroll + Insurance" value={String(summary.connectedSystems)} delta="Active channels" icon={<Workflow size={16} />} />
          <StatCard title="Synced Employees" subtitle="Auto-refresh" value={mappedEmployees} delta="Realtime sync" icon={<UsersRound size={16} />} />
          <StatCard title="Failed Syncs (24h)" subtitle="Needs attention" value={String(summary.failedSyncs)} delta="API/auth failures" icon={<AlertTriangle size={16} />} />
          <StatCard title="Last Sync" subtitle="Most recent update" value={summary.lastSync ? new Date(summary.lastSync).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }) : "—"} delta="Realtime mode" icon={<Clock3 size={16} />} />
        </div>
      </div>

      <section className="payroll-panels">
        <article className="payroll-card inbuilt">
          <div className="payroll-card-head">
            <div>
              <h4>Astikan HR & Payroll</h4>
              <p>Always available • Use this free inbuilt system or bulk upload employees.</p>
            </div>
            <span className={`chip ${state.payroll.inbuiltEnabled ? "chip-green" : ""}`}>{state.payroll.inbuiltEnabled ? "Active" : "Available"}</span>
          </div>
          <div className="payroll-card-actions">
            {!state.payroll.inbuiltEnabled ? (
              <button className="ghost-btn" onClick={handleEnableInbuilt}>Enable Astikan Payroll</button>
            ) : (
              <button className="ghost-btn" onClick={() => handleDisconnect("payroll", "inbuilt")}><CircleX size={14} /> Disable</button>
            )}
            <button className="ghost-btn" onClick={() => uploadRef.current?.click()}><UploadCloud size={14} /> Upload CSV/XLSX</button>
          </div>
        </article>

        <article className="payroll-card">
          <h4>Connected Payroll Systems</h4>
          {state.payroll.connected.length === 0 && (
            <div className="empty-state">
              <strong>No payroll integrations connected</strong>
              <p>Connect a provider below to sync employee mapping and finance data.</p>
            </div>
          )}
          {state.payroll.connected.map((s) => (
            <div className={`provider-row ${s.status === "Error" ? "provider-error" : ""}`} key={s.name}>
              <div>
                <h5>{s.name}</h5>
                <span>{s.employees.toLocaleString("en-IN")} employees • {s.cadence}</span>
              </div>
              <div className="provider-actions">
                <span className={`chip ${s.status === "Error" ? "chip-warning" : "chip-green"}`}>{s.status}</span>
                <button className="ghost-btn" onClick={() => handleSync("payroll", s.name)}><RefreshCw size={14} /> Sync</button>
                <button className="link-btn" onClick={() => handleDisconnect("payroll", s.name)}><CircleX size={14} /> Disconnect</button>
              </div>
            </div>
          ))}
        </article>
      </section>

      <section className="payroll-panels">
        <article className="payroll-card">
          <h4>Available Payroll Providers</h4>
          <div className="provider-grid">
            {state.payroll.available.map((provider) => (
              <button key={provider} className="provider-card" type="button" onClick={() => handleConnect("payroll", provider)}>
                <div>
                  <strong>{provider}</strong>
                  <p>Connect via OAuth and auto-sync employee roster.</p>
                </div>
                <span className="ghost-btn">Connect</span>
              </button>
            ))}
          </div>
        </article>
        <article className="payroll-card">
          <h4>Connected Insurance Partners</h4>
          {state.insurance.connected.length === 0 && (
            <div className="empty-state">
              <strong>No insurance partner connected</strong>
              <p>Connect group insurance to unlock claims + wellness coverage tracking.</p>
            </div>
          )}
          {state.insurance.connected.map((s) => (
            <div className={`provider-row ${s.status === "Error" ? "provider-error" : ""}`} key={s.name}>
              <div>
                <h5>{s.name}</h5>
                <span>{s.employees.toLocaleString("en-IN")} lives • {s.cadence}</span>
              </div>
              <div className="provider-actions">
                <span className={`chip ${s.status === "Error" ? "chip-warning" : "chip-green"}`}>{s.status}</span>
                <button className="ghost-btn" onClick={() => handleSync("insurance", s.name)}><RefreshCw size={14} /> Sync</button>
                <button className="link-btn" onClick={() => handleDisconnect("insurance", s.name)}><CircleX size={14} /> Disconnect</button>
              </div>
            </div>
          ))}
        </article>
      </section>

      <section className="payroll-panels">
        <article className="payroll-card upload-panel">
          <div>
            <h4>Bulk Upload</h4>
            <p>Upload payroll exports to sync employee IDs, departments, and finance mapping.</p>
          </div>
          <div className="upload-actions">
            <button className="ghost-btn" onClick={() => uploadRef.current?.click()}><UploadCloud size={14} /> Upload file</button>
            <button className="ghost-btn" onClick={exportFailedCsv}>Export failed list</button>
          </div>
          <input
            ref={uploadRef}
            type="file"
            accept=".csv,.xls,.xlsx"
            style={{ display: "none" }}
            onChange={(event) => handleUpload(event.target.files?.[0] ?? null)}
          />
          {previewRows.length > 0 && (
            <div className="upload-preview">
              <h5>Preview: {previewFilename}</h5>
              <table>
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((row) => (
                    <tr key={row.employeeId}>
                      <td>{row.employeeId}</td>
                      <td>{row.fullName}</td>
                      <td>{row.department}</td>
                      <td>{row.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </section>

      <section className="payroll-card sync-table">
        <div className="sync-head">
          <div>
            <h4>Live Sync Status</h4>
            <p>{employeeStats.total.toLocaleString("en-IN")} employees • {employeeStats.synced} synced • {employeeStats.pending} pending • {employeeStats.failed} failed</p>
          </div>
          <button className="ghost-btn" onClick={exportFailedCsv}>Export failed CSV</button>
        </div>
        <div className="table-shell">
          <table>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Email</th>
                <th>Status</th>
                <th>Last Sync</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {employeeRows.map((row) => (
                <tr key={row.employeeId}>
                  <td>{row.employeeId}</td>
                  <td>{row.fullName ?? "—"}</td>
                  <td>{row.department ?? "—"}</td>
                  <td>{row.email ?? "—"}</td>
                  <td><span className={`chip ${row.status === "Failed" ? "chip-warning" : row.status === "Pending" ? "chip" : "chip-green"}`}>{row.status}</span></td>
                  <td>{row.lastSyncAt ? new Date(row.lastSyncAt).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }) : "—"}</td>
                  <td>
                    {row.status === "Failed" ? (
                      <button className="link-btn" onClick={() => retryPayrollEmployee(companyId, row.employeeId)}>Retry</button>
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {employeeRows.length === 0 && (
                <tr>
                  <td colSpan={7}>No sync activity yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
