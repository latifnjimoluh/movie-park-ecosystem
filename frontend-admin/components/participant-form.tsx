"use client"

import { useEffect } from "react"
import type { Participant } from "@/lib/types"
import { Trash2 } from "lucide-react"
import { t } from "@/lib/i18n"
import { useTheme } from "@/lib/theme-context"

interface ParticipantFormProps {
  pack: string
  packCapacity: number
  participants: Participant[]
  onChange: (participants: Participant[]) => void
  isPayeur?: boolean
}

export default function ParticipantForm({
  pack,
  packCapacity,
  participants,
  onChange,
  isPayeur = false,
}: ParticipantFormProps) {
  const { language } = useTheme()
  const capacity = packCapacity
  const packNameLower = pack.toLowerCase()

  // Create the participant for COUPLE automatically after first render
  useEffect(() => {
    if (packNameLower === "couple" && participants.length === 0) {
      onChange([{ nom: "", prenom: "", email: "", telephone: "" }])
    }
  }, [packNameLower])

  const validateAlphanumeric = (value: string): string => {
    const cleaned = value.slice(0, 20)
    return cleaned
  }

  const validatePhoneNumber = (value: string): string => {
    if (!isPayeur) return value // No phone validation for participants
    const onlyDigits = value.replace(/\D/g, "")
    return onlyDigits.slice(0, 12)
  }

  const addParticipant = () => {
    if (participants.length < capacity - 1) {
      onChange([...participants, { nom: "", prenom: "", email: "", telephone: "" }])
    }
  }

  const updateParticipant = (index: number, field: string, value: string) => {
    let validatedValue = value
    if (field === "nom" || field === "prenom") {
      validatedValue = validateAlphanumeric(value)
    } else if (field === "telephone") {
      validatedValue = validatePhoneNumber(value)
    }

    const updated = [...participants]
    updated[index] = { ...updated[index], [field]: validatedValue }
    onChange(updated)
  }

  const removeParticipant = (index: number) => {
    const updated = participants.filter((_, i) => i !== index)
    onChange(updated)
  }

  const getPhoneError = (phone: string): string | null => {
    if (!isPayeur) return null
    if (phone && phone.length < 12) {
      return `${t("reservationForm.phoneLabel", language)} - ${t("reservationForm.incompleteNumber", language)} (${phone.length}/12)`
    }
    return null
  }

  // -----------------------------
  // PACK COUPLE
  // -----------------------------
  if (packNameLower === "couple") {
    const p = participants[0] || {}

    return (
      <div className="space-y-6">
        <p className="text-[#cccccc] text-sm md:text-base">{t("participantForm.coupleTitle", language)}</p>

        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Firstname */}
            <div>
              <label className="block text-[#f8f8f8] font-semibold mb-2 text-xs md:text-base">
                {t("participantForm.firstname", language)} *
              </label>
              <input
                type="text"
                value={p.prenom || ""}
                maxLength={20}
                placeholder={t("participantForm.placeholderFirstname", language)}
                onChange={(e) => updateParticipant(0, "prenom", e.target.value)}
                className="w-full px-4 py-3 bg-[#121212] border border-[#333] rounded-lg text-[#f8f8f8]"
                required
              />
              <p className="text-[#666666] text-xs mt-1">{(p.prenom || "").length}/20</p>
            </div>

            {/* Lastname */}
            <div>
              <label className="block text-[#f8f8f8] font-semibold mb-2 text-xs md:text-base">
                {t("participantForm.lastname", language)} *
              </label>
              <input
                type="text"
                value={p.nom || ""}
                maxLength={20}
                placeholder={t("participantForm.placeholderLastname", language)}
                onChange={(e) => updateParticipant(0, "nom", e.target.value)}
                className="w-full px-4 py-3 bg-[#121212] border border-[#333] rounded-lg text-[#f8f8f8]"
                required
              />
              <p className="text-[#666666] text-xs mt-1">{(p.nom || "").length}/20</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <label className="block text-[#f8f8f8] font-semibold mb-2 text-xs md:text-base">Email</label>
              <input
                type="email"
                value={p.email || ""}
                placeholder={t("reservationForm.emailPlaceholder", language)}
                onChange={(e) => updateParticipant(0, "email", e.target.value)}
                className="w-full px-4 py-3 bg-[#121212] border border-[#333] rounded-lg text-[#f8f8f8]"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[#f8f8f8] font-semibold mb-2 text-xs md:text-base">
                {t("reservationForm.phoneLabel", language)} {isPayeur && "*"}{" "}
                <span className="text-[#999999] text-xs font-normal">ex: 672475691</span>
              </label>
              <input
                type="tel"
                inputMode="numeric"
                value={p.telephone || ""}
                maxLength={isPayeur ? 12 : undefined}
                placeholder="672475691"
                onChange={(e) => updateParticipant(0, "telephone", e.target.value)}
                className={`w-full px-4 py-3 bg-[#121212] border rounded-lg text-[#f8f8f8]
                  ${getPhoneError(p.telephone || "") ? "border-[#dc143c]" : "border-[#333]"}`}
                required={isPayeur}
              />
              {getPhoneError(p.telephone || "") && (
                <p className="text-[#dc143c] text-xs mt-2">{getPhoneError(p.telephone || "")}</p>
              )}
              {isPayeur && <p className="text-[#666666] text-xs mt-1">{(p.telephone || "").length}/12 chiffres</p>}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // -------------------------------------
  // PACK FAMILLE / STAND / MULTI-PERSON
  // -------------------------------------
  return (
    <div className="space-y-6">
      <p className="text-[#cccccc] text-sm md:text-base">
        {t("participantForm.dynamicTitle", language)
          .replace("{{current}}", participants.length.toString())
          .replace("{{max}}", (capacity - 1).toString())}
      </p>

      <div className="space-y-4">
        {participants.map((p, index) => (
          <div key={index} className="flex gap-4 items-start">
            <div className="flex-1 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#f8f8f8] font-semibold mb-2">
                    {t("participantForm.firstname", language)} {index + 2} *
                  </label>
                  <input
                    type="text"
                    value={p.prenom || ""}
                    maxLength={20}
                    onChange={(e) => updateParticipant(index, "prenom", e.target.value)}
                    placeholder={t("participantForm.placeholderFirstname", language)}
                    className="w-full px-4 py-3 bg-[#121212] border border-[#333] rounded-lg text-[#f8f8f8]"
                    required
                  />
                  <p className="text-[#666666] text-xs mt-1">{(p.prenom || "").length}/20</p>
                </div>

                <div>
                  <label className="block text-[#f8f8f8] font-semibold mb-2">
                    {t("participantForm.lastname", language)} {index + 2} *
                  </label>
                  <input
                    type="text"
                    value={p.nom || ""}
                    maxLength={20}
                    onChange={(e) => updateParticipant(index, "nom", e.target.value)}
                    placeholder={t("participantForm.placeholderLastname", language)}
                    className="w-full px-4 py-3 bg-[#121212] border border-[#333] rounded-lg text-[#f8f8f8]"
                    required
                  />
                  <p className="text-[#666666] text-xs mt-1">{(p.nom || "").length}/20</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#f8f8f8] font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    value={p.email || ""}
                    onChange={(e) => updateParticipant(index, "email", e.target.value)}
                    placeholder={t("reservationForm.emailPlaceholder", language)}
                    className="w-full px-4 py-3 bg-[#121212] border border-[#333] rounded-lg text-[#f8f8f8]"
                  />
                </div>

                <div>
                  <label className="block text-[#f8f8f8] font-semibold mb-2">
                    {t("reservationForm.phoneLabel", language)}
                  </label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={p.telephone || ""}
                    onChange={(e) => updateParticipant(index, "telephone", e.target.value)}
                    placeholder="672475691"
                    className="w-full px-4 py-3 bg-[#121212] border border-[#333] rounded-lg text-[#f8f8f8]"
                  />
                  <p className="text-[#666666] text-xs mt-1">Optionnel</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => removeParticipant(index)}
              className="p-2 hover:bg-[#1a1a1a] rounded-lg text-[#a00000] mt-6"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {participants.length < capacity - 1 && (
        <button
          onClick={addParticipant}
          className="w-full px-6 py-3 border border-[#a00000] text-[#a00000] rounded-lg font-semibold hover:bg-[#a00000]/10"
        >
          {t("participantForm.addParticipant", language)
            .replace("{{current}}", (participants.length + 1).toString())
            .replace("{{max}}", (capacity - 1).toString())}
        </button>
      )}
    </div>
  )
}
