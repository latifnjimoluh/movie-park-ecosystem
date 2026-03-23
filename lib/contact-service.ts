import { API_ENDPOINTS } from "./api-config"


export async function submitContactForm(formData: {
  name: string
  email: string
  subject: string
  message: string
}): Promise<{ success: boolean; message: string }> {
  try {
    console.log("[v0] Submitting contact form...", formData)

    const response = await fetch(API_ENDPOINTS.CONTACT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("[v0] Contact form error:", errorData)
      throw new Error(errorData.message || `HTTP ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] Contact form submitted successfully:", data)

    return {
      success: true,
      message: "Votre message a été envoyé avec succès. Nous vous répondrons bientôt.",
    }
  } catch (error) {
    console.error("[v0] Error submitting contact form:", error)
    throw error
  }
}
