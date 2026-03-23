"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  reservation: any
}

export default function ConfirmationModal({ isOpen, onClose, reservation }: ConfirmationModalProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient || !isOpen) return null

  const whatsappMessage =
    `Bonjour,\n\n` +
    `Je viens de faire une réservation pour Movie in the Park.\n\n` +
    `Nom : ${reservation.nom}\n` +
    `Téléphone : ${reservation.telephone}\n` +
    `Pack choisi : ${reservation.packName}\n` +
    `Montant : ${reservation.totalPrice.toLocaleString("fr-FR")} XAF\n` +
    `Numéro de réservation : ${reservation.id}\n\n` +
    `Merci de me confirmer la suite des étapes.`

  const whatsappLink = `https://wa.me/237697304450?text=${encodeURIComponent(whatsappMessage)}`

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a0a0a] border-2 border-[#a00000] rounded-lg max-w-md w-full shadow-2xl animate-in fade-in">
        {/* Header */}
        <div className="bg-[#a00000] px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Action requise</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Main message */}
          <div>
            <h3 className="text-2xl font-bold text-[#dc143c] mb-2">Votre réservation est bien enregistrée</h3>

            <p className="text-[#cccccc] text-sm leading-relaxed">
              Pour continuer, merci de confirmer vos informations via WhatsApp. Le paiement peut être effectué
              maintenant ou plus tard. Notre équipe vous expliquera la suite.
            </p>

            <p className="text-[#999] text-xs mt-2 italic">
              Votre place sera considérée comme finalisée après confirmation avec un conseiller.
            </p>
          </div>

          {/* Pre-filled WhatsApp message */}
          <div className="bg-[#0a0a0a] border border-[#333] rounded-lg p-4">
            <p className="text-[#999] text-xs uppercase mb-2 font-semibold">Votre message pré-rempli</p>
            <pre className="text-[#ccc] text-xs whitespace-pre-wrap font-mono">{whatsappMessage}</pre>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            {/* Primary WhatsApp button */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-[#25d366] hover:bg-[#20ba5a] text-white text-center py-3 rounded-lg font-bold transition-colors"
            >
              ✓ Ouvrir WhatsApp pour confirmer ma réservation
            </a>

            {/* Secondary button */}
            <button
              onClick={onClose}
              className="w-full bg-[#333] hover:bg-[#444] text-white py-2 rounded-lg font-semibold text-sm transition-colors"
            >
              Continuer de lire les instructions sans confirmer maintenant
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
