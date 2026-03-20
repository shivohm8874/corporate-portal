import { Bell } from "lucide-react";

export function CommandCenterPage() {
  return (
    <div className="dash-shell">
      <div className="dash-topbar">
        <div className="brand-row">
          <div className="brand-mark">H</div>
          <strong>HCLTech</strong>
        </div>
        <div className="search-pill">
          <span className="search-icon">S</span>
          <input type="search" placeholder="Search employees or insights" />
        </div>
        <div className="top-actions">
          <button className="btn-primary">+ Add Employee</button>
          <div className="admin-chip">
            <span className="avatar-mini" />
            Admin v
          </div>
          <button className="icon-btn">*</button>
          <button className="icon-btn notif">
            <Bell size={16} />
            <span className="badge">3</span>
          </button>
        </div>
      </div>

      <div className="dash-title">Dashboard</div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-row">
            <div>
              <h4>Employee Engagement</h4>
              <p>Active participation</p>
            </div>
            <strong>82%</strong>
          </div>
          <div className="mini-bars">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="progress"><i style={{ width: "72%" }} /></div>
        </div>
        <div className="stat-card">
          <div className="stat-row">
            <div>
              <h4>Total Employees</h4>
              <p>Across all units</p>
            </div>
            <strong>2,486</strong>
          </div>
          <div className="mini-bars">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="progress"><i style={{ width: "65%" }} /></div>
        </div>
        <div className="stat-card">
          <div className="stat-row">
            <div>
              <h4>Employees Present</h4>
              <p>Today marked present</p>
            </div>
            <strong>2,198</strong>
          </div>
          <div className="mini-bars">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="progress"><i style={{ width: "78%" }} /></div>
        </div>
        <div className="stat-card">
          <div className="stat-row">
            <div>
              <h4>Employees Absent</h4>
              <p>Today marked absent</p>
            </div>
            <strong>288</strong>
          </div>
          <div className="mini-bars">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="progress"><i style={{ width: "42%" }} /></div>
        </div>
        <div className="stat-card wellness">
          <div className="stat-row">
            <div>
              <h4>Wellness index</h4>
              <p>Overall health</p>
            </div>
            <strong>78/100</strong>
          </div>
          <div className="ring" />
          <div className="trend">+4.2% in this month</div>
        </div>
      </div>

      <div className="mid-grid">
        <div className="trend-card">
          <div className="trend-head">
            <strong>Employee Health Trend</strong>
            <div className="tabs">
              <span className="tab active">Last 7 Days</span>
              <span className="tab">Last 30 Days</span>
              <span className="tab">Last 12 Months</span>
            </div>
          </div>
          <div className="chips">
            <span>Stress Index</span>
            <span>Sick Leave</span>
            <span>Sleep Score</span>
            <span>Activity Level</span>
          </div>
          <div className="trend-graph">
            <div className="wave one" />
            <div className="wave two" />
            <div className="wave three" />
            <div className="axis">
              <span>4.7 Apr</span>
              <span>8.24</span>
              <span>8.23</span>
              <span>9.23</span>
              <span>8.24</span>
            </div>
          </div>
        </div>
        <div className="insights-card">
          <div className="ins-head">
            <strong>AI Health Insights</strong>
            <button className="ghost-btn">View Suggestions v</button>
          </div>
          <div className="ins-row"><i>1</i> Finance team showing 14% higher stress</div>
          <div className="ins-row"><i>2</i> 3 employees flagged for burnout risk</div>
          <div className="ins-row"><i>3</i> Suggest scheduling wellness session</div>
        </div>
      </div>

      <div className="risk-grid">
        <div className="risk-card">
          <div className="risk-head">High Risk Employees</div>
          <div className="risk-item">
            <div className="avatar" />
            <div>
              <strong>Anika Rao</strong>
              <small>Operations</small>
              <p>Heart rate anomaly detected</p>
              <div className="bar"><i style={{ width: "78%" }} /></div>
            </div>
            <span className="tag danger">Alert</span>
          </div>
          <div className="risk-item">
            <div className="avatar" />
            <div>
              <strong>Rohit Menon</strong>
              <small>Field Sales</small>
              <p>Stress score elevated</p>
              <div className="bar"><i style={{ width: "62%" }} /></div>
            </div>
            <span className="tag danger">Alert</span>
          </div>
        </div>
        <div className="risk-card">
          <div className="risk-head">Moderate Risk <span className="sub">Watchlist</span></div>
          <div className="risk-item">
            <div className="avatar" />
            <div>
              <strong>Ishaan Patel</strong>
              <small>Finance</small>
              <p>Sleep score lower than peers</p>
              <div className="bar"><i style={{ width: "58%" }} /></div>
            </div>
            <span className="tag warn">5 days</span>
          </div>
          <div className="risk-item">
            <div className="avatar" />
            <div>
              <strong>Pooja Nair</strong>
              <small>People Ops</small>
              <p>Showing early fatigue</p>
              <div className="bar"><i style={{ width: "52%" }} /></div>
            </div>
            <span className="tag warn">5 days</span>
          </div>
        </div>
        <div className="risk-card">
          <div className="risk-head">Steep Employees</div>
          <div className="risk-item">
            <div className="avatar" />
            <div>
              <strong>Divya Mehta</strong>
              <small>Engineering</small>
              <p>Optimal vitals this week</p>
              <div className="bar"><i style={{ width: "88%" }} /></div>
            </div>
            <span className="tag good">+9.2%</span>
          </div>
          <div className="risk-item">
            <div className="avatar" />
            <div>
              <strong>Kabir Shah</strong>
              <small>HR</small>
              <p>Suggest overtime pattern</p>
              <div className="bar"><i style={{ width: "76%" }} /></div>
            </div>
            <span className="tag good">-7.1%</span>
          </div>
        </div>
        <div className="risk-card">
          <div className="risk-head">Stable Employees</div>
          <div className="risk-item">
            <div className="avatar" />
            <div>
              <strong>Divya Mehta</strong>
              <small>Engineering</small>
              <p>Optimal vitals this week</p>
              <div className="bar"><i style={{ width: "90%" }} /></div>
            </div>
            <span className="tag good">+5.2%</span>
          </div>
          <div className="risk-item">
            <div className="avatar" />
            <div>
              <strong>Kabir Shah</strong>
              <small>HR</small>
              <p>Healthy sleep pattern</p>
              <div className="bar"><i style={{ width: "84%" }} /></div>
            </div>
            <span className="tag good">Today</span>
          </div>
        </div>
      </div>

      <div className="bottom-row">
        <div className="attendance-card">
          <div className="attendance-head">
            <strong>Attendance Summary</strong>
            <span>March</span>
          </div>
          <div className="attendance-graph">
            <span style={{ height: "40%" }} />
            <span style={{ height: "65%" }} />
            <span style={{ height: "55%" }} />
            <span style={{ height: "80%" }} />
            <span style={{ height: "60%" }} />
            <span style={{ height: "90%" }} />
          </div>
          <div className="attendance-footer">
            <span>8,92,300</span>
            <small>sale/month</small>
          </div>
        </div>
        <div className="savings-card">
          <div className="savings-head">
            <strong>Monthly Savings</strong>
          </div>
          <div className="savings-bar">
            <i style={{ width: "70%" }} />
          </div>
          <div className="savings-meta">
            <span>INR 22.8L</span>
            <small>Saved</small>
          </div>
        </div>
      </div>
    </div>
  );
}
