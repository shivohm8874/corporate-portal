import { SectionTitle } from '../components/ui';

export function SettingsPage() {
  return (
    <div className="page page-settings">
      <SectionTitle title="Settings" subtitle="Configure organization profile, integrations, and notifications" />
      <div className="grid cols-2">
        <section className="card panel">
          <h2>Organization</h2>
          <label>Company Name<input className="input" defaultValue="HCLTech" /></label>
          <label>Wellness Program Budget<input className="input" defaultValue="₹1.7Cr / year" /></label>
          <label>Timezone<input className="input" defaultValue="Asia/Kolkata" /></label>
          <button className="primary-btn">Save Profile</button>
        </section>
        <section className="card panel">
          <h2>Notifications</h2>
          {['Credit below threshold alerts', 'Health risk forecast updates', 'Payroll sync failures', 'Monthly ROI summary'].map((n, i) => (
            <label className="toggle-row" key={n}><span>{n}</span><input type="checkbox" defaultChecked={i !== 2} /></label>
          ))}
          <button className="primary-btn">Update Preferences</button>
        </section>
      </div>
    </div>
  );
}
