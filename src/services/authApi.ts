import { apiPost } from './api'

export type CorporateAuthorizeResponse = {
  companyId: string
  corporateId: string
  companyName: string
  companySlug?: string | null
}

export type CorporateLoginResponse = {
  userId: string
  role: string
  fullName?: string | null
  email?: string | null
  phone?: string | null
  companyId?: string | null
  companyName?: string | null
  companySlug?: string | null
}

const CORPORATE_SESSION_KEY = "astikan_corporate_session"

export function saveCorporateSession(payload: CorporateLoginResponse & { corporateId: string }) {
  localStorage.setItem(CORPORATE_SESSION_KEY, JSON.stringify(payload))
}

export function getCorporateSession(): (CorporateLoginResponse & { corporateId: string }) | null {
  const raw = localStorage.getItem(CORPORATE_SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as CorporateLoginResponse & { corporateId: string }
  } catch {
    return null
  }
}

export function clearCorporateSession() {
  localStorage.removeItem(CORPORATE_SESSION_KEY)
}

export function authorizeCorporate(corporateId: string) {
  return apiPost<CorporateAuthorizeResponse, { corporateId: string }>('/auth/corporate/authorize', { corporateId })
}

export function loginCorporate(corporateId: string, username: string, password: string) {
  return apiPost<CorporateLoginResponse, { corporateId: string; username: string; password: string }>(
    '/auth/corporate/login',
    { corporateId, username, password },
  )
}
