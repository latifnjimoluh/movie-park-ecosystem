const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

export const API_URL = API_BASE_URL

export const API_ENDPOINTS = {
  RESERVATIONS:  `${API_BASE_URL}/reservations`,
  PACKS:         `${API_BASE_URL}/packs`,
  CONTACT:       `${API_BASE_URL}/contact`,
  FILMS:         `${API_BASE_URL}/films`,
  SCHEDULE:      `${API_BASE_URL}/schedule`,
  TESTIMONIALS:  `${API_BASE_URL}/testimonials`,
  EVENT_CONFIG:  `${API_BASE_URL}/event-config`,
}

export default API_BASE_URL
