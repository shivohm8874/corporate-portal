import { apiGet, apiPost } from "./api";

export type CorporateRegistrationPayload = {
  companyName: string;
  pan: string;
  gstNo: string;
  address: string;
  entityType: string;
  incorporationDate: string;
  employeeCount?: number;
  referralCode?: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  documents: {
    gst: DocumentUpload;
    pan: DocumentUpload;
    incorporation: DocumentUpload;
    insurer?: DocumentUpload | null;
    msme?: DocumentUpload | null;
    labourCompliance?: DocumentUpload | null;
  };
  authorizedSignature: DocumentUpload;
  signedAgreement: DocumentUpload;
  agreementText: string;
};

export type DocumentUpload = {
  name: string;
  type: string;
  size: number;
  dataUrl: string;
};

export type CorporateRegistrationResponse = {
  applicationId: string;
  companyId: string;
  status: "pending" | "active" | "rejected";
  companyCode?: string;
  submittedAt: string;
};

export type CorporateRegistrationStatus = CorporateRegistrationResponse & {
  companyName: string;
  contactEmail: string;
  contactPhone: string;
};

export function submitCorporateRegistration(payload: CorporateRegistrationPayload) {
  return apiPost<CorporateRegistrationResponse, CorporateRegistrationPayload>("/corporate/registrations", payload);
}

export function fetchCorporateRegistrationStatus(applicationId: string) {
  return apiGet<CorporateRegistrationStatus>(`/corporate/registrations/${applicationId}`);
}
