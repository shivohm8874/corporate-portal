import { Bell } from "lucide-react";
import { useState } from "react";

export function WorkforcePage() {
  const [showImport, setShowImport] = useState(false);

  return (
    <div className="emp-shell">
      <div className="emp-topbar">
        <div className="brand-row">
          <div className="brand-mark">H</div>
          <strong>HCLTech</strong>
        </div>
        <div className="search-pill">
          <span className="search-icon">S</span>
          <input type="search" placeholder="Search employees..." />
        </div>
        <div className="top-actions">
          <button className="btn-primary" type="button">+ Add Employee</button>
          <button className="btn-ghost" type="button" onClick={() => setShowImport(true)}>Import Bulk Upload</button>
          <button className="icon-btn notif" type="button">
            <Bell size={16} />
            <span className="badge">2</span>
          </button>
        </div>
      </div>

      <div className="emp-header">
        <h1>Employees</h1>
        <div className="emp-sync">
          <button className="pill" type="button">Select All v</button>
          <button className="pill" type="button">Synced v</button>
          <span className="sync-tag">Synced: last 1m</span>
        </div>
      </div>

      <div className="emp-metrics">
        <div className="metric-card">
          <strong>Total Employees 248</strong>
          <div className="dropdown">All Departments v</div>
          <div className="metric-bars">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
        <div className="metric-card">
          <strong>Risk Level</strong>
          <div className="search-mini">
            <input placeholder="Search employees..." />
            <span>Q</span>
          </div>
        </div>
        <div className="metric-card">
          <strong>Health Score</strong>
          <div className="score-row">
            <div className="score">78</div>
            <div className="score-meta">/100
              <small>Total Stress</small>
            </div>
            <div className="mini-donut" />
          </div>
        </div>
        <div className="metric-card">
          <strong>Average Health Score 78</strong>
          <div className="trend-mini">
            <span>+4.2%</span>
            <small>in this month</small>
          </div>
          <div className="spark" />
        </div>
        <div className="metric-card">
          <strong>At Risk Employees</strong>
          <div className="risk-count">8</div>
          <small>Assess employees</small>
          <div className="mini-donut warn" />
        </div>
      </div>

      <div className="emp-toolbar">
        <button className="pill" type="button">Select All v</button>
        <button className="pill" type="button">Bulk Actions v</button>
        <button className="pill" type="button">Export CSV v</button>
        <div className="toolbar-search">
          <input placeholder="Search employees..." />
          <span>Q</span>
        </div>
        <div className="toolbar-search">
          <input placeholder="Search employees..." />
          <span>Q</span>
        </div>
      </div>

      <div className="emp-table">
        <div className="emp-row head">
          <span><input type="checkbox" /> Select All</span>
          <span>Employees</span>
          <span>Department</span>
          <span>Health Score</span>
          <span>Stress</span>
          <span>Attendance</span>
          <span>Risk Level</span>
          <span>Status</span>
          <span>...</span>
        </div>
        {[
          ["Anika Rao", "Operations", "62", "High", "85%", "High", "Active"],
          ["Rohit Menon", "Sales", "74", "Medium", "92%", "Moderate", "Active"],
          ["Divya Mehta", "Engineering", "88", "Low", "99%", "High", "Active"],
          ["Kabir Shah", "HR", "64", "Low", "93%", "Moderate", "Active"],
          ["Sara Joseph", "Marketing", "79", "Low", "95%", "Low", "Active"],
          ["Manish Gupta", "Design", "89", "Stable", "91%", "Low", "Active"],
          ["Pooja Nair", "People Ops", "72", "Stable", "93%", "Low", "Active"],
          ["Arjun Malik", "Engineering", "86", "Stable", "96%", "Low", "Active"],
        ].map((row) => (
          <div className="emp-row" key={row[0]}>
            <span><input type="checkbox" /></span>
            <span className="emp-name">
              <i className="avatar">
                {row[0]
                  .split(' ')
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </i>
              {row[0]}
            </span>
            <span>{row[1]}</span>
            <span className="score-pill">{row[2]}</span>
            <span>{row[3]}</span>
            <span className="attend-bar"><i style={{ width: row[4] }} /></span>
            <span className="risk-pill">{row[5]}</span>
            <span>{row[6]}</span>
            <span>...</span>
          </div>
        ))}
        <div className="emp-footer">
          <span>1 - 10 of 248</span>
          <div className="pager">1 2 3 4 5 6 7 8</div>
        </div>
      </div>

      <div className="emp-selection">
        <span>3 Employees selected</span>
        <button className="pill" type="button">Send Health Alert</button>
        <button className="pill" type="button">Assign Wellness Program</button>
        <button className="pill" type="button">More Actions v</button>
      </div>

      <div className="emp-footer-row">
        <span>10 rows/page</span>
        <div className="pager">1 2 3 4 5 6 7 8 9 10</div>
      </div>

      {showImport && (
        <div className="import-overlay" role="dialog" aria-modal="true">
          <div className="import-modal">
            <div className="import-head">
              <strong>Import Employees</strong>
              <button className="icon-btn" type="button" onClick={() => setShowImport(false)}>x</button>
            </div>
            <p>Welcome to bulk upload, all employees.</p>
            <button className="btn-ghost" type="button">Download template</button>
            <div className="drop-zone">
              <div className="drop-icon">+</div>
              <p>Drag & drop CSV (Max: 5 MB)</p>
              <button className="btn-primary" type="button">Browse File</button>
            </div>
            <small>Review and ensure your template is filled out correctly before upload</small>
            <div className="import-actions">
              <button className="btn-ghost" type="button">Download CSV Sample</button>
              <button className="btn-ghost" type="button">Download Sample</button>
            </div>
            <div className="import-table">
              <div className="import-row head">
                <span>Name</span>
                <span>Department</span>
                <span>Employee ID</span>
                <span>ID</span>
              </div>
              <div className="import-row">
                <span>Anika Rau</span>
                <span>Operations</span>
                <span>EMP-1001</span>
                <span>EMP-1001</span>
              </div>
              <div className="import-row">
                <span>Rohit Menon</span>
                <span>Sales</span>
                <span>EMP-1006</span>
                <span>EMP-1006</span>
              </div>
              <div className="import-row">
                <span>Divya Mehta</span>
                <span>Engineering</span>
                <span>EMP-0904</span>
                <span>EMP-0904</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
