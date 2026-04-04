"use client"

import { useState, useEffect } from "react"
import { getReservationsByPhone } from "@/lib/reservation-service"
import type { Reservation } from "@/lib/types"
import { ArrowLeft, Ticket, CheckCircle, Clock, XCircle } from "lucide-react"
import { t } from "@/lib/i18n"
import { useTheme } from "@/lib/theme-context"

interface ReservationTrackingProps {
  phone: string
  onReset: () => void
}

export default function ReservationTracking({ phone, onReset }: ReservationTrackingProps) {
  const { language } = useTheme()

  const [reservations, setReservations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const load = async () => {
      setLoading(true)
      try {
        const found = await getReservationsByPhone(phone)
        if (!mounted) return
        setReservations(found)
      } catch (err) {
        console.error("[v0] Error loading reservations by phone:", err)
        if (mounted) setReservations([])
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [phone])


  // ----- LOADING -----
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 rounded-full border-4 border-[#333333] border-t-[#854D0E] animate-spin mx-auto mb-4" />
        <p className="text-[#cccccc]">{t("reservationTracking.loading", language)}</p>
      </div>
    )
  }

  // ----- NO RESERVATION -----
  if (reservations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-[#cccccc] mb-6">{t("reservationTracking.noReservation", language)}</p>

        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 bg-[#121212] hover:bg-[#1a1a1a] 
                     text-[#f8f8f8] px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("reservationTracking.retry", language)}
        </button>
      </div>
    )
  }

  // ----- RESERVATIONS LIST -----
  return (
    <div className="space-y-6">
      {reservations.map((reservation) => {
        const statusMap: Record<string, string> = {
          confirmé: t("reservationTracking.status_confirmed", language),
          paiement_partiel: t("reservationTracking.status_partial", language),
          en_attente_paiement: t("reservationTracking.status_pending", language),
          paye: t("reservationTracking.status_paid", language),
        }

        const statusLabel = statusMap[reservation.status] || reservation.status

        return (
          <div key={reservation.id} className="bg-[#121212] rounded-lg p-8 border border-[#333333]">
            {/* HEADER */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-[#f8f8f8]">
                  {t("reservationTracking.reservation", language).replace("{{id}}", String(reservation.id))}
                </h3>

                <p className="text-[#999999] text-sm">
                  {t("reservationTracking.date", language)} :{" "}
                  {new Date(reservation.createdAt).toLocaleDateString(language === "fr" ? "fr-FR" : "en-US")}
                </p>
              </div>

              <div
                className={`px-4 py-2 rounded-full font-semibold text-white ${
                  reservation.status === "confirmé"
                    ? "bg-[#28a745]"
                    : reservation.status === "paiement_partiel"
                      ? "bg-[#ffc107]"
                      : reservation.status === "en_attente_paiement"
                        ? "bg-[#854D0E]"
                        : "bg-[#007bff]"
                }`}
              >
                {statusLabel}
              </div>
            </div>

            {/* DETAILS */}
            <div className="grid md:grid-cols-2 gap-6 pb-6 border-b border-[#333333] mb-6">
              <div>
                <p className="text-sm text-[#999999] mb-2">{t("reservationTracking.pack", language)}</p>
                <p className="text-lg font-semibold text-[#f8f8f8]">{reservation.packName || reservation.pack}</p>
              </div>

              <div>
                <p className="text-sm text-[#999999] mb-2">{t("reservationTracking.totalAmount", language)}</p>
                <p className="text-2xl font-bold text-[#FACC15]">
                  {(reservation.totalPrice || reservation.total_price || 0).toLocaleString("fr-FR")} XAF
                </p>
              </div>

              <div>
                <p className="text-sm text-[#999999] mb-2">{t("reservationTracking.paidAmount", language)}</p>
                <p className="text-lg font-semibold text-[#f8f8f8]">
                  {(reservation.amountPaid || reservation.total_paid || 0).toLocaleString("fr-FR")} XAF
                </p>
              </div>

              <div>
                <p className="text-sm text-[#999999] mb-2">{t("reservationTracking.remainingAmount", language)}</p>
                <p className="text-lg font-semibold text-[#854D0E]">
                  {(reservation.remaining || (reservation.total_price - reservation.total_paid) || 0).toLocaleString("fr-FR")} XAF
                </p>
              </div>
            </div>

            {/* RESERVING PERSON */}
            <div className="mb-6">
              <p className="text-sm text-[#999999] mb-3">{t("reservationTracking.reservingPerson", language)}</p>
              <p className="text-[#f8f8f8]">{reservation.nom}</p>
            </div>

            {/* TICKETS */}
            {reservation.tickets && reservation.tickets.length > 0 && (
              <div className="border-t border-[#333333] pt-6">
                <p className="text-sm text-[#999999] mb-4 flex items-center gap-2">
                  <Ticket className="w-4 h-4" />
                  {language === "fr" ? "Vos tickets" : "Your tickets"}
                </p>
                <div className="space-y-3">
                  {reservation.tickets.map((ticket: any) => (
                    <div key={ticket.id} className="bg-[#0a0a0a] rounded-lg p-4 border border-[#333333]">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-[#f8f8f8] text-sm font-bold">{ticket.ticket_number}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1
                          ${ticket.status === "valid" ? "bg-[#28a745]/20 text-[#28a745]" :
                            ticket.status === "used" ? "bg-[#007bff]/20 text-[#007bff]" :
                            "bg-[#dc3545]/20 text-[#dc3545]"}`}>
                          {ticket.status === "valid" ? <CheckCircle className="w-3 h-3" /> :
                           ticket.status === "used" ? <CheckCircle className="w-3 h-3" /> :
                           <XCircle className="w-3 h-3" />}
                          {ticket.status === "valid" ? (language === "fr" ? "Valide" : "Valid") :
                           ticket.status === "used" ? (language === "fr" ? "Utilisé" : "Used") :
                           (language === "fr" ? "Annulé" : "Cancelled")}
                        </span>
                      </div>
                      {ticket.qr_image_url && (
                        <div className="flex justify-center mt-3">
                          <img
                            src={ticket.qr_image_url}
                            alt={`QR Code ${ticket.ticket_number}`}
                            className="w-40 h-40 rounded-lg border border-[#333333]"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No ticket yet indicator */}
            {(!reservation.tickets || reservation.tickets.length === 0) && reservation.status !== "cancelled" && (
              <div className="border-t border-[#333333] pt-6">
                <div className="flex items-center gap-3 text-[#999999] text-sm">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <p>{language === "fr"
                    ? "Votre ticket sera généré une fois le paiement complet validé."
                    : "Your ticket will be generated once full payment is confirmed."
                  }</p>
                </div>
              </div>
            )}

          </div>
        )
      })}

      {/* RESET BUTTON */}
      <button
        onClick={onReset}
        className="w-full inline-flex items-center justify-center gap-2 
                   bg-[#121212] hover:bg-[#1a1a1a] 
                   text-[#f8f8f8] px-6 py-3 rounded-lg font-semibold transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {t("reservationTracking.newSearch", language)}
      </button>
    </div>
  )
}
