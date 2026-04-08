import { useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { fetchCorporateRegistrationStatus, type CorporateRegistrationStatus } from "../services/corporateRegistrationApi";
import "../styles/register.css";

export function CorporateTrackStatusPage() {
  const [status, setStatus] = useState<CorporateRegistrationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("corporate_registration");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as { applicationId?: string };
        if (parsed.applicationId) {
          void loadStatus(parsed.applicationId);
          return;
        }
      } catch {
        // ignore
      }
    }
    setLoading(false);
    setError("No application found. Please register your company first.");
  }, []);

  const loadStatus = async (applicationId: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetchCorporateRegistrationStatus(applicationId);
      setStatus(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to fetch application status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-page">
      <section className="register-card register-success">
        <h1>Application status</h1>
        {loading ? (
          <div className="status-loading">
            <Loader2 className="spin" size={20} />
            <span>Fetching latest status...</span>
          </div>
        ) : null}
        {error ? <p className="auth-error">{error}</p> : null}
        {status ? (
          <div className="register-summary">
            <div>
              <span>Company name</span>
              <strong>{status.companyName}</strong>
            </div>
            <div>
              <span>Application ID</span>
              <strong>{status.applicationId}</strong>
            </div>
            <div>
              <span>Company ID</span>
              <strong>{status.companyId}</strong>
            </div>
            <div>
              <span>Status</span>
              <strong>{status.status}</strong>
            </div>
            <div>
              <span>Contact email</span>
              <strong>{status.contactEmail}</strong>
            </div>
            <div>
              <span>Contact phone</span>
              <strong>{status.contactPhone}</strong>
            </div>
          </div>
        ) : null}
        {status && status.status === "active" ? (
          <div className="status-ready">
            <CheckCircle2 size={20} />
            <span>Your corporate access is approved. Please check your email for login credentials.</span>
          </div>
        ) : null}
      </section>
    </main>
  );
}
