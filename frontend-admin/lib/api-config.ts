const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

export const API_URL = API_BASE_URL

export const API_ENDPOINTS = {
  RESERVATIONS: `${API_BASE_URL}/reservations`,
  PACKS: `${API_BASE_URL}/packs`,
  CONTACT: `${API_BASE_URL}/contact`,
}

export default API_BASE_URL
