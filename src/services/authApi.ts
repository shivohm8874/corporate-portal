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
const CORPORATE_SESSION_KEY_FALLBACK = "astikan_corporate_session"

export function saveCorporateSession(payload: CorporateLoginResponse & { corporateId: string }) {
  sessionStorage.setItem(CORPORATE_SESSION_KEY, JSON.stringify(payload))
}

export function getCorporateSession(): (CorporateLoginResponse & { corporateId: string }) | null {
  const raw = sessionStorage.getItem(CORPORATE_SESSION_KEY)
  if (raw) {
    try {
      return JSON.parse(raw) as CorporateLoginResponse & { corporateId: string }
    } catch {
      // fall through
    }
  }
  const legacy = localStorage.getItem(CORPORATE_SESSION_KEY_FALLBACK)
  if (!legacy) return null
  try {
    return JSON.parse(legacy) as CorporateLoginResponse & { corporateId: string }
  } catch {
    return null
  }
}

export function clearCorporateSession() {
  sessionStorage.removeItem(CORPORATE_SESSION_KEY)
  localStorage.removeItem(CORPORATE_SESSION_KEY_FALLBACK)
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
