"use client"

const BASE_URL = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3000/api"
const API_TIMEOUT_MS = 10000 // 10 seconds

// ---------------- TOKEN MANAGEMENT ----------------
// Access token kept in localStorage ONLY as a client-side auth indicator and fallback header.
// The httpOnly cookie set by the backend is the primary (XSS-safe) auth mechanism.
function getAccessToken() {
  return localStorage.getItem("admin_token")
}

function getRefreshToken() {
  return localStorage.getItem("admin_refresh_token")
}

function saveTokens(access: string, refresh: string) {
  localStorage.setItem("admin_token", access)
  localStorage.setItem("admin_refresh_token", refresh)
}

function logout() {
  localStorage.removeItem("admin_token")
  localStorage.removeItem("admin_refresh_token")
  localStorage.removeItem("admin_role")
  // Call backend to clear httpOnly cookies
  fetch(`${BASE_URL}/auth/logout`, { method: "POST", credentials: "include" }).catch(() => {})
  window.location.href = "/admin/login"
}

// ---------------- REQUEST WRAPPER ----------------
async function request(method: string, url: string, body?: any) {
  const token = getAccessToken()
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS)

  const options: RequestInit = {
    method,
    credentials: "include", // Send httpOnly cookies automatically
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    signal: controller.signal,
  }

  try {
    let res = await fetch(`${BASE_URL}${url}`, options)
    clearTimeout(timeoutId)

    // ----------- TOKEN EXPIRED → REFRESH -----------
    if (res.status === 401 && getRefreshToken()) {
      const refreshed = await refreshAccessToken()

      if (refreshed) {
        const newToken = getAccessToken()
        const retryController = new AbortController()
        const retryTimeout = setTimeout(() => retryController.abort(), API_TIMEOUT_MS)

        const retryOptions = {
          ...options,
          headers: {
            ...options.headers,
            ...(newToken ? { Authorization: `Bearer ${newToken}` } : {}),
          },
          signal: retryController.signal,
        }

        res = await fetch(`${BASE_URL}${url}`, retryOptions)
        clearTimeout(retryTimeout)
      }
    }

    // ----------- PROCESS RESPONSE -----------
    const json = await res.json().catch(() => null)

    if (!res.ok) {
      throw new Error(json?.message || "Une erreur s'est produite")
    }

    return json.data || json
  } catch (err: any) {
    clearTimeout(timeoutId)
    if (err.name === "AbortError") {
      throw new Error("La requête a expiré. Vérifiez votre connexion.")
    }
    throw err
  }
}

// ---------------- REFRESH TOKEN ----------------
async function refreshAccessToken() {
  try {
    const refreshToken = getRefreshToken()
    if (!refreshToken) return false

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS)

    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include", // Uses httpOnly refresh_token cookie
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      signal: controller.signal,
    })
    clearTimeout(timeoutId)

    if (!res.ok) {
      logout()
      return false
    }

    const json = await res.json()
    saveTokens(json.data.token, refreshToken)
    return true
  } catch {
    logout()
    return false
  }
}

// ---------------- API GROUPS ----------------

export const api = {
  baseURL: BASE_URL,
  // ---------- AUTH ----------
  auth: {
    login: (email: string, password: string) => request("POST", "/auth/login", { email, password }),

    me: () => request("GET", "/auth/me"),

    refresh: () => request("POST", "/auth/refresh"),

    logout: () => {
      logout()
    },
  },

  // ---------- ROLES & PERMISSIONS ----------
  roles: {
    getAll: () => request("GET", "/auth/roles"),
    updatePermissions: (roleId: string, permissions: string[]) => 
      request("PUT", `/auth/roles/${roleId}/permissions`, { permissions }),
  },

  // ---------- PACKS ----------
  packs: {
    getAll: () => request("GET", "/packs"),
    create: (data: any) => request("POST", "/packs", data),
    update: (id: string, data: any) => request("PUT", `/packs/${id}`, data),
    delete: (id: string) => request("DELETE", `/packs/${id}`),
  },

  // ---------- RESERVATIONS ----------
  reservations: {
    getAll: (params = "") => request("GET", `/reservations${params}`),
    getOne: (id: string) => request("GET", `/reservations/${id}`),
    create: (data: any) => request("POST", "/reservations", data),
    update: (id: string, data: any) => request("PUT", `/reservations/${id}`, data),
    cancel: (id: string) => request("POST", `/reservations/${id}/cancel`),
    export: (params = "") => `${BASE_URL}/reservations/export${params}`,
  },

  // ---------- PAYMENTS ----------
  payments: {
    getAll: () => request("GET", "/payments"),
    add: (reservation_id: string, data: any) => request("POST", `/reservations/${reservation_id}/payments`, data),
    delete: (reservation_id: string, payment_id: string) =>
      request("DELETE", `/payments/${reservation_id}/${payment_id}`),
  },

  // ---------- TICKETS ----------
  tickets: {
    getAll: () => request("GET", "/tickets"),
    generate: (reservationId: string) => request("POST", `/tickets/${reservationId}/generate`),
    getOne: (id: string) => request("GET", `/tickets/${id}`),
  },

  // ---------- SCAN ----------
  scan: {
    decode: (qr_payload: string) => request("POST", "/tickets/decode", { qr_payload }),

    validate: (data: any) => request("POST", "/tickets/validate", data),

    jwtValidate: (qr_payload: string) => request("POST", "/scan/validate", { qr_payload }),

    stats: () => request("GET", "/scan/stats"),
  },

  // ---------- USERS ----------
  users: {
    getAll: () => request("GET", "/users"),
    create: (data: any) => request("POST", "/users", data),
    update: (id: string, data: any) => request("PUT", `/users/${id}`, data),
    delete: (id: string) => request("DELETE", `/users/${id}`),
  },

  // ---------- AUDIT ----------
  audit: {
    getAll: (params = "") => request("GET", `/audit${params}`),
  },

  // ---------- FILMS ----------
  films: {
    getAll: (params = "") => request("GET", `/films${params}`),
    getOne: (id: string) => request("GET", `/films/${id}`),
    create: (data: any) => request("POST", "/films", data),
    update: (id: string, data: any) => request("PUT", `/films/${id}`, data),
    delete: (id: string) => request("DELETE", `/films/${id}`),
  },

  // ---------- SCHEDULE ----------
  schedule: {
    getAll: (params = "") => request("GET", `/schedule${params}`),
    getOne: (id: string) => request("GET", `/schedule/${id}`),
    create: (data: any) => request("POST", "/schedule", data),
    update: (id: string, data: any) => request("PUT", `/schedule/${id}`, data),
    delete: (id: string) => request("DELETE", `/schedule/${id}`),
  },

  // ---------- TESTIMONIALS ----------
  testimonials: {
    getAll: (params = "") => request("GET", `/testimonials${params}`),
    getOne: (id: string) => request("GET", `/testimonials/${id}`),
    create: (data: any) => request("POST", "/testimonials", data),
    update: (id: string, data: any) => request("PUT", `/testimonials/${id}`, data),
    delete: (id: string) => request("DELETE", `/testimonials/${id}`),
  },

  // ---------- EVENT CONFIG ----------
  eventConfig: {
    getAll: () => request("GET", "/event-config"),
    upsert: (key: string, value: string, type?: string, label?: string, group?: string) =>
      request("POST", "/event-config/upsert", { key, value, type, label, group }),
    bulkUpsert: (configs: Array<{ key: string; value: string; type?: string; label?: string; group?: string }>) =>
      request("POST", "/event-config/bulk", { configs }),
    delete: (id: string) => request("DELETE", `/event-config/${id}`),
  },
}
