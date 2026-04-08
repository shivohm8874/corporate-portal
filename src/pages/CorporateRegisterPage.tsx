import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, FileUp, ShieldCheck } from "lucide-react";
import {
  submitCorporateRegistration,
  type CorporateRegistrationPayload,
  type DocumentUpload,
} from "../services/corporateRegistrationApi";
import "../styles/register.css";

type UploadState = {
  gst?: DocumentUpload;
  pan?: DocumentUpload;
  incorporation?: DocumentUpload;
  insurer?: DocumentUpload | null;
  msme?: DocumentUpload | null;
  labourCompliance?: DocumentUpload | null;
  signature?: DocumentUpload;
  agreement?: DocumentUpload;
};

type RegisterResult = {
  applicationId: string;
  companyId: string;
  status: "pending" | "active" | "rejected";
  submittedAt: string;
};

const ENTITY_TYPES = ["Private Limited", "Public Limited", "LLP", "Partnership", "Proprietorship", "Trust / NGO"];

function buildAgreementText(data: {
  companyName: string;
  pan: string;
  gstNo: string;
  address: string;
  entityType: string;
  incorporationDate: string;
  referralCode?: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}) {
  return [
    "ASTIKAN CORPORATE WELLNESS AGREEMENT",
    "",
    `Company Name: ${data.companyName}`,
    `PAN: ${data.pan}`,
    `GST No: ${data.gstNo}`,
    `Entity Type: ${data.entityType}`,
    `Date of Incorporation: ${data.incorporationDate}`,
    `Address: ${data.address}`,
    data.referralCode ? `Referral Code: ${data.referralCode}` : null,
    "",
    "Authorized Contact",
    `Name: ${data.contactName}`,
    `Email: ${data.contactEmail}`,
    `Phone: ${data.contactPhone}`,
    "",
    "By signing this agreement, the company agrees to comply with Astikan program policies, onboarding requirements, and billing terms as provided in the corporate portal.",
  ]
    .filter(Boolean)
    .join("\n");
}

async function readFileAsDataUrl(file: File): Promise<DocumentUpload> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });
  return {
    name: file.name,
    type: file.type,
    size: file.size,
    dataUrl,
  };
}

export function CorporateRegisterPage() {
  const [step, setStep] = useState<"info" | "docs" | "agreement" | "done">("info");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<RegisterResult | null>(null);
  const [uploads, setUploads] = useState<UploadState>({});
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [agreementGenerated, setAgreementGenerated] = useState(false);

  const [form, setForm] = useState({
    companyName: "",
    pan: "",
    gstNo: "",
    address: "",
    entityType: ENTITY_TYPES[0],
    incorporationDate: "",
    employeeCount: "",
    referralCode: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
  });

  const agreementText = useMemo(() => buildAgreementText(form), [form]);

  const validationInfo = useMemo(() => {
    const errors: string[] = [];
    const panValue = form.pan.trim().toUpperCase();
    const gstValue = form.gstNo.trim().toUpperCase();
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!form.companyName.trim()) errors.push("Company name is required.");
    if (!panValue) errors.push("PAN is required.");
    if (panValue && !panRegex.test(panValue)) errors.push("PAN format is invalid.");
    if (!gstValue) errors.push("GST number is required.");
    if (gstValue && !gstRegex.test(gstValue)) errors.push("GST number format is invalid.");
    if (!form.address.trim()) errors.push("Address is required.");
    if (!form.incorporationDate.trim()) errors.push("Date of incorporation is required.");
    if (!form.employeeCount.trim()) errors.push("Employee count is required.");
    if (!form.contactName.trim()) errors.push("Authorized contact name is required.");
    if (!form.contactEmail.trim()) errors.push("Authorized contact email is required.");
    if (!form.contactPhone.trim()) errors.push("Authorized contact phone is required.");
    return errors;
  }, [form]);

  const validationDocs = useMemo(() => {
    const errors: string[] = [];
    if (!uploads.gst) errors.push("GST certificate is required.");
    if (!uploads.pan) errors.push("PAN document is required.");
    if (!uploads.incorporation) errors.push("Incorporation certificate is required.");
    if (!uploads.signature) errors.push("Authorized signature is required.");
    if (!uploads.agreement) errors.push("Signed agreement upload is required.");
    if (!agreementAccepted) errors.push("Please accept the agreement terms.");
    return errors;
  }, [uploads, agreementAccepted]);

  const updateForm = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpload = async (key: keyof UploadState, file?: File | null) => {
    if (!file) {
      setUploads((prev) => ({ ...prev, [key]: undefined }));
      return;
    }
    try {
      const payload = await readFileAsDataUrl(file);
      setUploads((prev) => ({ ...prev, [key]: payload }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to read file.");
    }
  };

  const downloadAgreement = () => {
    const blob = new Blob([agreementText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${form.companyName || "Astikan"}-Agreement.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setAgreementGenerated(true);
  };

  const submitRegistration = async () => {
    if (validationDocs.length) {
      setError(validationDocs[0]);
      return;
    }
    if (!uploads.gst || !uploads.pan || !uploads.incorporation || !uploads.signature || !uploads.agreement) {
      setError("Please upload all mandatory documents.");
      return;
    }

    const payload: CorporateRegistrationPayload = {
      companyName: form.companyName.trim(),
      pan: form.pan.trim(),
      gstNo: form.gstNo.trim(),
      address: form.address.trim(),
      entityType: form.entityType,
      incorporationDate: form.incorporationDate,
      employeeCount: form.employeeCount ? Number(form.employeeCount) : undefined,
      referralCode: form.referralCode.trim() || undefined,
      contactName: form.contactName.trim(),
      contactEmail: form.contactEmail.trim(),
      contactPhone: form.contactPhone.trim(),
      documents: {
        gst: uploads.gst,
        pan: uploads.pan,
        incorporation: uploads.incorporation,
        insurer: uploads.insurer ?? null,
        msme: uploads.msme ?? null,
        labourCompliance: uploads.labourCompliance ?? null,
      },
      authorizedSignature: uploads.signature,
      signedAgreement: uploads.agreement,
      agreementText,
    };

    setLoading(true);
    setError("");
    try {
      const response = await submitCorporateRegistration(payload);
      setResult(response);
      localStorage.setItem("corporate_registration", JSON.stringify({ ...response, companyName: payload.companyName }));
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit registration.");
    } finally {
      setLoading(false);
    }
  };

  const goNext = () => {
    if (step === "info") {
      if (validationInfo.length) {
        setError(validationInfo[0]);
        return;
      }
      setError("");
      setStep("docs");
      return;
    }
    if (step === "docs") {
      if (!uploads.gst || !uploads.pan || !uploads.incorporation) {
        setError("Please upload GST, PAN, and incorporation certificate.");
        return;
      }
      setError("");
      setStep("agreement");
      return;
    }
  };

  if (step === "done" && result) {
    return (
      <main className="register-page">
        <section className="register-card register-success">
          <CheckCircle2 size={36} />
          <h1>Registration submitted</h1>
          <p>Your corporate onboarding request is now in review.</p>
          <div className="register-summary">
            <div>
              <span>Application ID</span>
              <strong>{result.applicationId}</strong>
            </div>
            <div>
              <span>Company ID</span>
              <strong>{result.companyId}</strong>
            </div>
            <div>
              <span>Status</span>
              <strong>{result.status}</strong>
            </div>
            <div>
              <span>Submitted</span>
              <strong>{new Date(result.submittedAt).toLocaleString()}</strong>
            </div>
          </div>
          <button
            className="primary-btn"
            type="button"
            onClick={() => {
              window.location.assign("/track-status");
            }}
          >
            Track Status
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="register-page">
      <section className="register-card">
        <header>
          <span className="register-kicker">Corporate Portal</span>
          <h1>Register your organisation</h1>
          <p>Complete the onboarding form, upload documents, sign the agreement, and submit for approval.</p>
        </header>

        <div className="register-steps">
          <div className={`register-step ${step === "info" ? "active" : ""}`}>1. Company Info</div>
          <div className={`register-step ${step === "docs" ? "active" : ""}`}>2. Documents</div>
          <div className={`register-step ${step === "agreement" ? "active" : ""}`}>3. Agreement</div>
        </div>

        {step === "info" ? (
          <section className="register-section">
            <div className="field-grid">
              <label>
                Company name *
                <input value={form.companyName} onChange={(e) => updateForm("companyName", e.target.value)} />
              </label>
              <label>
                PAN *
                <input value={form.pan} onChange={(e) => updateForm("pan", e.target.value.toUpperCase())} />
              </label>
              <label>
                GST No *
                <input value={form.gstNo} onChange={(e) => updateForm("gstNo", e.target.value.toUpperCase())} />
              </label>
              <label>
                Services / Entity *
                <select value={form.entityType} onChange={(e) => updateForm("entityType", e.target.value)}>
                  {ENTITY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Date of incorporation *
                <input type="date" value={form.incorporationDate} onChange={(e) => updateForm("incorporationDate", e.target.value)} />
              </label>
              <label>
                Employee Count *
                <input
                  type="number"
                  min={1}
                  value={form.employeeCount}
                  onChange={(e) => updateForm("employeeCount", e.target.value.replace(/[^0-9]/g, ""))}
                />
              </label>
              <label>
                Referral code
                <input value={form.referralCode} onChange={(e) => updateForm("referralCode", e.target.value)} />
              </label>
              <label className="field-full">
                Registered address *
                <textarea rows={3} value={form.address} onChange={(e) => updateForm("address", e.target.value)} />
              </label>
              <label>
                Authorised contact name *
                <input value={form.contactName} onChange={(e) => updateForm("contactName", e.target.value)} />
              </label>
              <label>
                Authorised contact email *
                <input type="email" value={form.contactEmail} onChange={(e) => updateForm("contactEmail", e.target.value)} />
              </label>
              <label>
                Authorised contact phone *
                <input value={form.contactPhone} onChange={(e) => updateForm("contactPhone", e.target.value)} />
              </label>
            </div>
            <button className="primary-btn small-btn" type="button" onClick={goNext}>
              Next <ArrowRight size={16} />
            </button>
          </section>
        ) : null}

        {step === "docs" ? (
          <section className="register-section">
            <div className="upload-grid">
              <label className="upload-card">
                GST Certificate *
                <input type="file" onChange={(e) => handleUpload("gst", e.target.files?.[0])} />
                <span>{uploads.gst?.name ?? "Upload GST document"}</span>
              </label>
              <label className="upload-card">
                PAN Document *
                <input type="file" onChange={(e) => handleUpload("pan", e.target.files?.[0])} />
                <span>{uploads.pan?.name ?? "Upload PAN document"}</span>
              </label>
              <label className="upload-card">
                Incorporation Certificate *
                <input type="file" onChange={(e) => handleUpload("incorporation", e.target.files?.[0])} />
                <span>{uploads.incorporation?.name ?? "Upload incorporation certificate"}</span>
              </label>
              <label className="upload-card">
                Insurer Certificate
                <input type="file" onChange={(e) => handleUpload("insurer", e.target.files?.[0])} />
                <span>{uploads.insurer?.name ?? "Upload insurer certificate"}</span>
              </label>
              <label className="upload-card">
                MSME Certificate
                <input type="file" onChange={(e) => handleUpload("msme", e.target.files?.[0])} />
                <span>{uploads.msme?.name ?? "Upload MSME certificate"}</span>
              </label>
              <label className="upload-card">
                Labour Compliance Certificate
                <input type="file" onChange={(e) => handleUpload("labourCompliance", e.target.files?.[0])} />
                <span>{uploads.labourCompliance?.name ?? "Upload labour compliance certificate"}</span>
              </label>
            </div>
            <button className="primary-btn small-btn" type="button" onClick={goNext}>
              Next <ArrowRight size={16} />
            </button>
          </section>
        ) : null}

        {step === "agreement" ? (
          <section className="register-section">
            <div className="agreement-card">
              <div>
                <h3>Auto-generated agreement</h3>
                <p>Download, sign, and upload the signed agreement. Then submit your registration.</p>
              </div>
              <button className="ghost-btn" type="button" onClick={downloadAgreement}>
                Download agreement
              </button>
            </div>
            <div className="agreement-preview">
              <pre>{agreementText}</pre>
            </div>
            <div className="upload-grid">
              <label className="upload-card">
                Authorized signature *
                <input type="file" onChange={(e) => handleUpload("signature", e.target.files?.[0])} />
                <span>{uploads.signature?.name ?? "Upload signature"}</span>
              </label>
              <label className="upload-card">
                Signed agreement *
                <input type="file" onChange={(e) => handleUpload("agreement", e.target.files?.[0])} />
                <span>{uploads.agreement?.name ?? "Upload signed agreement"}</span>
              </label>
            </div>
            <label className="agreement-check">
              <input type="checkbox" checked={agreementAccepted} onChange={(e) => setAgreementAccepted(e.target.checked)} />
              <span>
                I confirm that the uploaded agreement is signed by the authorized signatory.
              </span>
            </label>
            <button className="primary-btn" type="button" onClick={submitRegistration} disabled={loading || !agreementGenerated}>
              {loading ? "Submitting..." : "Submit registration"}
            </button>
            {!agreementGenerated ? (
              <p className="helper-text">
                Please download the agreement before submitting.
              </p>
            ) : null}
          </section>
        ) : null}

        {error ? <p className="auth-error">{error}</p> : null}
        <div className="register-support">
          <ShieldCheck size={18} />
          <span>All uploads are encrypted and visible only to the Astikan superadmin team.</span>
        </div>
      </section>

      <aside className="register-progress">
        <div className="progress-card progress-highlight">
          <h3>Protect your workforce with Astikan</h3>
          <p>
            Save your wealth and your employees&apos; health with Astikan Health Programme.
            Submit your onboarding and we will take care of the rest.
          </p>
          <div className="progress-pills">
            <span>24-48 hour review</span>
            <span>Dedicated corporate team</span>
          </div>
        </div>
        <div className="progress-card">
          <h3>Need help?</h3>
          <p>Our corporate onboarding team will review your submission within 24-48 hours.</p>
          <div className="support-chip">
            <FileUp size={16} />
            <span>support@astikan.health</span>
          </div>
        </div>
      </aside>
    </main>
  );
}
