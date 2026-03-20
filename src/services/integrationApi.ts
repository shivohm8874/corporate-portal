import { apiPost } from './api'

export type IntegrationItem = {
  name: string
  status: 'Connected' | 'Error' | 'Pending'
  employees: number
  cadence: string
  lastSyncAt?: string | null
}

export type IntegrationState = {
  companyId: string
  payroll: {
    connected: IntegrationItem[]
    available: string[]
    inbuiltEnabled?: boolean
    uploads?: Array<{ filename: string; rows: number; uploadedAt: string }>
  }
  insurance: {
    connected: IntegrationItem[]
    available: string[]
  }
  lastSyncAt?: string | null
  failedSyncs24h?: number
}

export type IntegrationSummary = {
  connectedSystems: number
  syncedEmployees: number
  failedSyncs: number
  lastSync?: string | null
}

export function fetchPayrollInsuranceState(companyId: string) {
  return apiPost<{ state: IntegrationState; summary: IntegrationSummary }, { companyId: string }>(
    '/integrations/payroll-insurance',
    { companyId },
  )
}

export function connectIntegration(payload: { companyId: string; type: 'payroll' | 'insurance'; name?: string; mode?: 'provider' | 'inbuilt' }) {
  return apiPost<{ state: IntegrationState; summary: IntegrationSummary }, typeof payload>(
    '/integrations/payroll-insurance/connect',
    payload,
  )
}

export function disconnectIntegration(payload: { companyId: string; type: 'payroll' | 'insurance'; name: string }) {
  return apiPost<{ state: IntegrationState; summary: IntegrationSummary }, typeof payload>(
    '/integrations/payroll-insurance/disconnect',
    payload,
  )
}

export function syncIntegration(payload: { companyId: string; type: 'payroll' | 'insurance'; name: string }) {
  return apiPost<{ state: IntegrationState; summary: IntegrationSummary }, typeof payload>(
    '/integrations/payroll-insurance/sync',
    payload,
  )
}

export function uploadPayrollFile(payload: { companyId: string; filename: string; rows?: number }) {
  return apiPost<{ state: IntegrationState; summary: IntegrationSummary }, typeof payload>(
    '/integrations/payroll-insurance/upload',
    payload,
  )
}

export function uploadPayrollEmployees(payload: {
  companyId: string
  filename: string
  rows?: number
  employees: Array<{ employeeId: string; fullName?: string; department?: string; email?: string }>
}) {
  return apiPost<{ state: IntegrationState; summary: IntegrationSummary }, typeof payload>(
    '/integrations/payroll-insurance/upload',
    payload,
  )
}

export function fetchPayrollEmployees(companyId: string, limit = 50) {
  return apiPost<{ rows: Array<{ employeeId: string; fullName?: string; department?: string; email?: string; status: string; lastSyncAt?: string }>; stats: { total: number; synced: number; pending: number; failed: number } }, { companyId: string; limit: number }>(
    '/integrations/payroll-insurance/employees',
    { companyId, limit },
  )
}

export function retryPayrollEmployee(companyId: string, employeeId: string) {
  return apiPost<{ queued: boolean }, { companyId: string; employeeId: string }>(
    '/integrations/payroll-insurance/employees/retry',
    { companyId, employeeId },
  )
}
