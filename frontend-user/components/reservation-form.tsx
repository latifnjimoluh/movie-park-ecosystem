"use client"

import { t } from "@/lib/i18n"
import { useTheme } from "@/lib/theme-context"

interface ReservationFormProps {
  formData: {
    nom: string
    prenom: string
    telephone: string
    email: string
    howDidYouKnow: string
  }
  onChange: (field: string, value: string) => void
  errors?: { [key: string]: string }
}

export default function ReservationForm({ formData, onChange, errors = {} }: ReservationFormProps) {
  const { language } = useTheme()

  const validateAlphanumeric = (value: string): string => {
    // Allow alphanumeric (a-z, A-Z, 0-9) and special characters, max 20 chars
    const cleaned = value.slice(0, 20)
    return cleaned
  }

  const validatePhoneNumber = (value: string): string => {
    // Only digits, no specific length requirement (optional field)
    const onlyDigits = value.replace(/\D/g, "")
    return onlyDigits.slice(0, 9) // Max 9 digits (without 237 prefix)
  }

  const getNomError = (): string | null => {
    if (formData.nom && formData.nom.length > 20) {
      return `${t("reservationForm.lastnameLabel", language)} - ${t("reservationForm.maxCharacters", language)}`
    }
    return null
  }

  const getPrenomError = (): string | null => {
    if (formData.prenom && formData.prenom.length > 20) {
      return `${t("reservationForm.firstnameLabel", language)} - ${t("reservationForm.maxCharacters", language)}`
    }
    return null
  }

  const getPhoneError = (): string | null => {
    if (!formData.telephone || formData.telephone.length === 0) {
      return `${t("reservationForm.phoneLabel", language)} - ${t("reservationForm.required", language)}` // CHANGÉ ICI
    }
    if (formData.telephone.length < 9) {
      return `${t("reservationForm.phoneLabel", language)} - ${t("reservationForm.minDigits", language)}`
    }
    return null
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* FIRSTNAME */}
      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
        <div>
          <label className="block text-[#f8f8f8] font-semibold mb-2 text-xs md:text-base">
            {t("reservationForm.firstnameLabel", language)} <span className="text-[#FACC15]">*</span>
          </label>
          <input
            type="text"
            value={formData.prenom}
            onChange={(e) => onChange("prenom", validateAlphanumeric(e.target.value))}
            maxLength={20}
            className={`w-full px-3 md:px-4 py-2 md:py-3 bg-[#121212] border 
                       rounded-lg text-[#f8f8f8] placeholder-[#666666] 
                       focus:outline-none focus:ring-1 text-xs md:text-sm
                       ${
                         getPrenomError()
                           ? "border-[#FACC15] focus:border-[#FACC15] focus:ring-[#FACC15]"
                           : "border-[#333333] focus:border-[#854D0E] focus:ring-[#854D0E]"
                       }`}
            placeholder={t("reservationForm.firstnamePlaceholder", language)}
          />
          <p className="text-[#666666] text-xs mt-1">{formData.prenom.length}/20</p>
          {getPrenomError() && <p className="text-[#FACC15] text-xs mt-2">{getPrenomError()}</p>}
        </div>

        {/* LASTNAME */}
        <div>
          <label className="block text-[#f8f8f8] font-semibold mb-2 text-xs md:text-base">
            {t("reservationForm.lastnameLabel", language)} <span className="text-[#FACC15]">*</span>
          </label>
          <input
            type="text"
            value={formData.nom}
            onChange={(e) => onChange("nom", validateAlphanumeric(e.target.value))}
            maxLength={20}
            className={`w-full px-3 md:px-4 py-2 md:py-3 bg-[#121212] border 
                       rounded-lg text-[#f8f8f8] placeholder-[#666666] 
                       focus:outline-none focus:ring-1 text-xs md:text-sm
                       ${
                         getNomError()
                           ? "border-[#FACC15] focus:border-[#FACC15] focus:ring-[#FACC15]"
                           : "border-[#333333] focus:border-[#854D0E] focus:ring-[#854D0E]"
                       }`}
            placeholder={t("reservationForm.lastnamePlaceholder", language)}
          />
          <p className="text-[#666666] text-xs mt-1">{formData.nom.length}/20</p>
          {getNomError() && <p className="text-[#FACC15] text-xs mt-2">{getNomError()}</p>}
        </div>
      </div>

      {/* PHONE - NOW REQUIRED */}
      <div>
        <label className="block text-[#f8f8f8] font-semibold mb-2 text-xs md:text-base">
          {t("reservationForm.phoneLabel", language)} <span className="text-[#FACC15]">*</span>
        </label>
        <div className="flex">
          <span className="flex items-center px-3 py-2 md:py-3 bg-[#1a1a1a] border border-r-0 border-[#333333] rounded-l-lg text-[#999999] text-sm font-mono select-none">
            +237
          </span>
          <input
            type="tel"
            inputMode="numeric"
            value={formData.telephone}
            onChange={(e) => onChange("telephone", validatePhoneNumber(e.target.value))}
            maxLength={9}
            className={`flex-1 px-3 md:px-4 py-2 md:py-3 bg-[#121212] border rounded-r-lg text-[#f8f8f8] placeholder-[#666666]
                       focus:outline-none focus:ring-1 text-xs md:text-sm
                       ${
                         getPhoneError()
                           ? "border-[#FACC15] focus:border-[#FACC15] focus:ring-[#FACC15]"
                           : "border-[#333333] focus:border-[#854D0E] focus:ring-[#854D0E]"
                       }`}
            placeholder="6XXXXXXXX"
          />
        </div>
        <p className="text-[#666666] text-xs mt-1">
          {formData.telephone.length}/9 chiffres
        </p>
        {getPhoneError() && <p className="text-[#FACC15] text-xs mt-2">{getPhoneError()}</p>}
      </div>

      {/* EMAIL */}
      <div>
        <label className="block text-[#f8f8f8] font-semibold mb-2 text-xs md:text-base">
          {t("reservationForm.emailLabel", language)}
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => onChange("email", e.target.value)}
          className="w-full px-3 md:px-4 py-2 md:py-3 bg-[#121212] border border-[#333333] 
                     rounded-lg text-[#f8f8f8] placeholder-[#666666] 
                     focus:outline-none focus:border-[#854D0E] focus:ring-1 
                     focus:ring-[#854D0E] text-xs md:text-sm"
          placeholder={t("reservationForm.emailPlaceholder", language)}
        />
      </div>

      {/* HOW DID YOU KNOW */}
      <div>
        <label className="block text-[#f8f8f8] font-semibold mb-2 text-xs md:text-base">
          {t("reservationForm.sourceLabel", language)}
        </label>

        <select
          value={formData.howDidYouKnow}
          onChange={(e) => onChange("howDidYouKnow", e.target.value)}
          className="w-full px-3 md:px-4 py-2 md:py-3 bg-[#121212] border border-[#333333] 
                     rounded-lg text-[#f8f8f8] focus:outline-none 
                     focus:border-[#854D0E] focus:ring-1 focus:ring-[#854D0E] 
                     text-xs md:text-sm"
        >
          <option value="">{t("reservationForm.sourcePlaceholder", language)}</option>
          <option value="facebook">{t("reservationForm.sourceFacebook", language)}</option>
          <option value="instagram">{t("reservationForm.sourceInstagram", language)}</option>
          <option value="ami">{t("reservationForm.sourceFriend", language)}</option>
          <option value="autre">{t("reservationForm.sourceOther", language)}</option>
        </select>
      </div>
    </div>
  )
}
