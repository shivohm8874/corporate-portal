import { useMemo, useState } from 'react';
import {
  Activity,
  CircleX,
  Link2,
  Plus,
  RefreshCw,
  Search,
  Upload,
  Users,
  UserPlus2,
} from 'lucide-react';
import { ProgressBar, SectionTitle, StatCard } from '../components/ui';

type ProviderName = 'greytHR' | 'RazorpayX Payroll' | 'Keka';

export function WorkforcePage() {
  const [activeAction, setActiveAction] = useState<'add' | 'upload' | 'connect' | 'fetch'>('add');
  const [employeeQuery, setEmployeeQuery] = useState('');
  const [employeeStatusFilter, setEmployeeStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [employeeDeptFilter, setEmployeeDeptFilter] = useState<'all' | 'Engineering' | 'Sales' | 'Operations' | 'Finance' | 'HR'>('all');
  const [employeeName, setEmployeeName] = useState('');
  const [employeeEmail, setEmployeeEmail] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');
  const [uploadFileName, setUploadFileName] = useState('');
  const [connectedProvider, setConnectedProvider] = useState<ProviderName>('greytHR');
  const [fetchWindow, setFetchWindow] = useState<'delta' | 'full'>('delta');
  const [activityLog, setActivityLog] = useState<string[]>([
    'Fetched 48 new employees from greytHR 6 minutes ago.',
    'CSV import completed. 126 employees added, 4 failed validation.',
    'RazorpayX Payroll token refreshed successfully.',
  ]);

  const hasValidAddEmployee = useMemo(
    () => employeeName.trim().length > 1 && employeeEmail.includes('@') && employeeCode.trim().length > 1,
    [employeeCode, employeeEmail, employeeName]
  );

  const pushActivity = (entry: string) => {
    setActivityLog((prev) => [entry, ...prev].slice(0, 6));
  };

  const submitAddEmployee = () => {
    if (!hasValidAddEmployee) {
      pushActivity('Add Employee blocked. Fill name, valid email, and employee code.');
      return;
    }

    pushActivity(`Employee "${employeeName}" queued for creation and corporate assignment.`);
    setEmployeeName('');
    setEmployeeEmail('');
    setEmployeeCode('');
  };

  const triggerUpload = () => {
    if (!uploadFileName.trim()) {
      pushActivity('Upload blocked. Add a CSV file name to continue.');
      return;
    }

    pushActivity(`CSV "${uploadFileName}" accepted for validation and bulk employee import.`);
    setUploadFileName('');
  };

  const triggerConnect = () => {
    pushActivity(`${connectedProvider} integration handshake started. Waiting for OAuth callback.`);
  };

  const triggerFetch = () => {
    const mode = fetchWindow === 'delta' ? 'last 24 hours changes' : 'full employee base';
    pushActivity(`Fetch started from ${connectedProvider} for ${mode}.`);
  };

  const employees = [
    { code: 'EMP-1001', name: 'Aditi Sharma', email: 'aditi.sharma@corp.com', department: 'Engineering', status: 'active', joinedAt: '2023-08-11' },
    { code: 'EMP-1038', name: 'Rohan Mehta', email: 'rohan.mehta@corp.com', department: 'Sales', status: 'active', joinedAt: '2022-12-19' },
    { code: 'EMP-1087', name: 'Priya Nair', email: 'priya.nair@corp.com', department: 'Operations', status: 'inactive', joinedAt: '2021-05-04' },
    { code: 'EMP-1124', name: 'Karan Bedi', email: 'karan.bedi@corp.com', department: 'Finance', status: 'active', joinedAt: '2024-01-22' },
    { code: 'EMP-1172', name: 'Sneha Iyer', email: 'sneha.iyer@corp.com', department: 'HR', status: 'active', joinedAt: '2020-10-14' },
    { code: 'EMP-1219', name: 'Arjun Khanna', email: 'arjun.khanna@corp.com', department: 'Engineering', status: 'inactive', joinedAt: '2019-03-30' },
  ] as const;

  const filteredEmployees = employees.filter((employee) => {
    const q = employeeQuery.trim().toLowerCase();
    const qMatch =
      !q ||
      employee.name.toLowerCase().includes(q) ||
      employee.email.toLowerCase().includes(q) ||
      employee.code.toLowerCase().includes(q);
    const statusMatch = employeeStatusFilter === 'all' || employee.status === employeeStatusFilter;
    const deptMatch = employeeDeptFilter === 'all' || employee.department === employeeDeptFilter;
    return qMatch && statusMatch && deptMatch;
  });

  return (
    <div className="page page-workforce">
      <SectionTitle title="Employee Overview" subtitle="Understand employee participation by team" />
      <div className="grid cols-4">
        <StatCard title="Total Employees" subtitle="Company strength" value="2,685" delta="Updated 2 mins ago" icon={<Users size={16} />} />
        <StatCard title="Active" subtitle="Using health services" value="2,507" delta="93.4% active" icon={<Activity size={16} />} />
        <StatCard title="Inactive" subtitle="No activity in 30 days" value="178" delta="Needs intervention" icon={<CircleX size={16} />} />
        <StatCard title="Active Rate" subtitle="Total utilization" value="93.4%" delta="+1.8% this month" icon={<RefreshCw size={16} />} />
      </div>

      <section className="card panel">
        <h2>Employee Operations Hub</h2>
        <p className="workforce-subline">
          Frontend-ready controls for employee onboarding and payroll-driven sync. Connect these actions to backend APIs.
        </p>

        <div className="workforce-action-tabs">
          <button className={`ghost-btn ${activeAction === 'add' ? 'tab-active' : ''}`} onClick={() => setActiveAction('add')}>
            <UserPlus2 size={14} /> Add Employee
          </button>
          <button className={`ghost-btn ${activeAction === 'upload' ? 'tab-active' : ''}`} onClick={() => setActiveAction('upload')}>
            <Upload size={14} /> Upload Employees
          </button>
          <button className={`ghost-btn ${activeAction === 'connect' ? 'tab-active' : ''}`} onClick={() => setActiveAction('connect')}>
            <Link2 size={14} /> Connect Payroll
          </button>
          <button className={`ghost-btn ${activeAction === 'fetch' ? 'tab-active' : ''}`} onClick={() => setActiveAction('fetch')}>
            <Search size={14} /> Fetch Employees
          </button>
        </div>

        <div className="workforce-ops-grid">
          <article className="workforce-ops-form soft-card">
            {activeAction === 'add' && (
              <>
                <strong>Manual Employee Add</strong>
                <label>
                  Employee Name
                  <input className="input" placeholder="e.g. Aditi Sharma" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} />
                </label>
                <label>
                  Employee Email
                  <input className="input" placeholder="aditi@company.com" value={employeeEmail} onChange={(e) => setEmployeeEmail(e.target.value)} />
                </label>
                <label>
                  Employee Code
                  <input className="input" placeholder="EMP-1038" value={employeeCode} onChange={(e) => setEmployeeCode(e.target.value)} />
                </label>
                <button className="primary-btn" onClick={submitAddEmployee}>
                  <Plus size={14} /> Create Employee
                </button>
              </>
            )}

            {activeAction === 'upload' && (
              <>
                <strong>Bulk Upload (CSV)</strong>
                <label>
                  CSV File Name
                  <input className="input" placeholder="employees-march.csv" value={uploadFileName} onChange={(e) => setUploadFileName(e.target.value)} />
                </label>
                <small>Required columns: employee_code, name, email, phone, department, payroll_id.</small>
                <button className="primary-btn" onClick={triggerUpload}>
                  <Upload size={14} /> Validate & Upload
                </button>
              </>
            )}

            {activeAction === 'connect' && (
              <>
                <strong>Payroll Connector</strong>
                <label>
                  Provider
                  <select className="input" value={connectedProvider} onChange={(e) => setConnectedProvider(e.target.value as ProviderName)}>
                    <option value="greytHR">greytHR</option>
                    <option value="RazorpayX Payroll">RazorpayX Payroll</option>
                    <option value="Keka">Keka</option>
                  </select>
                </label>
                <small>OAuth or token exchange should be handled by backend callback routes.</small>
                <button className="primary-btn" onClick={triggerConnect}>
                  <Link2 size={14} /> Start Connection
                </button>
              </>
            )}

            {activeAction === 'fetch' && (
              <>
                <strong>Fetch Employees from Payroll</strong>
                <label>
                  Source Provider
                  <select className="input" value={connectedProvider} onChange={(e) => setConnectedProvider(e.target.value as ProviderName)}>
                    <option value="greytHR">greytHR</option>
                    <option value="RazorpayX Payroll">RazorpayX Payroll</option>
                    <option value="Keka">Keka</option>
                  </select>
                </label>
                <div className="workforce-fetch-mode">
                  <button className={`ghost-btn ${fetchWindow === 'delta' ? 'tab-active' : ''}`} onClick={() => setFetchWindow('delta')}>Delta Sync</button>
                  <button className={`ghost-btn ${fetchWindow === 'full' ? 'tab-active' : ''}`} onClick={() => setFetchWindow('full')}>Full Sync</button>
                </div>
                <button className="primary-btn" onClick={triggerFetch}>
                  <RefreshCw size={14} /> Fetch Now
                </button>
              </>
            )}
          </article>

          <article className="soft-card workforce-activity">
            <strong>Recent Employee Ops Activity</strong>
            <div className="workforce-activity-list">
              {activityLog.map((entry) => (
                <div className="workforce-activity-row" key={entry}>
                  <span className="chip chip-info">Event</span>
                  <p>{entry}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="card panel">
        <div className="row-bet">
          <h2>Employee Directory</h2>
          <span className="chip chip-info">{filteredEmployees.length} visible</span>
        </div>
        <div className="employee-list-toolbar">
          <input
            className="input"
            placeholder="Search by employee name, email, or code"
            value={employeeQuery}
            onChange={(e) => setEmployeeQuery(e.target.value)}
          />
          <select className="input" value={employeeStatusFilter} onChange={(e) => setEmployeeStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select className="input" value={employeeDeptFilter} onChange={(e) => setEmployeeDeptFilter(e.target.value as 'all' | 'Engineering' | 'Sales' | 'Operations' | 'Finance' | 'HR')}>
            <option value="all">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Sales">Sales</option>
            <option value="Operations">Operations</option>
            <option value="Finance">Finance</option>
            <option value="HR">HR</option>
          </select>
        </div>

        <div className="employee-grid">
          <div className="employee-grid-head">
            <span>Employee</span>
            <span>Code</span>
            <span>Department</span>
            <span>Status</span>
            <span>Joined</span>
          </div>
          {filteredEmployees.map((employee) => (
            <div className="employee-grid-row" key={employee.code}>
              <div>
                <strong>{employee.name}</strong>
                <small>{employee.email}</small>
              </div>
              <span>{employee.code}</span>
              <span>{employee.department}</span>
              <span className={`chip ${employee.status === 'active' ? 'chip-green' : 'chip-warning'}`}>
                {employee.status === 'active' ? 'Active' : 'Inactive'}
              </span>
              <span>{employee.joinedAt}</span>
            </div>
          ))}
          {filteredEmployees.length === 0 && (
            <div className="employee-grid-empty">No employees found for current filter.</div>
          )}
        </div>
      </section>

      <section className="card panel">
        <h2>Department Heatmap</h2>
        <div className="grid cols-4">
          {[
            ['Engineering', 842, 94.8], ['Sales', 324, 92.9], ['Marketing', 156, 94.9], ['Operations', 512, 91.4],
            ['Finance', 128, 95.3], ['HR', 64, 96.9], ['Customer Support', 421, 91.2], ['Product', 238, 94.1],
          ].map((d) => (
            <article className="dept-card" key={d[0]}>
              <h4>{d[0]}</h4>
              <small>{d[1]} employees</small>
              <div className="row-bet"><span>Engagement</span><strong>{d[2]}%</strong></div>
              <ProgressBar value={d[2] as number} />
            </article>
          ))}
        </div>
      </section>

      <section className="card panel">
        <h2>Payroll Sync Status</h2>
        <div className="grid cols-3">
          {['greytHR', 'RazorpayX Payroll', 'Zoho People'].map((s) => (
            <article className="soft-card" key={s}><strong>{s}</strong><span>Connected</span></article>
          ))}
        </div>
      </section>
    </div>
  );
}
