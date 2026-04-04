"use client"

import type { Reservation } from "@/lib/types"
import { CheckCircle, Smartphone, AlertCircle } from "lucide-react"
import { t } from "@/lib/i18n"
import { useTheme } from "@/lib/theme-context"

interface PaymentInstructionsProps {
  reservation: Reservation | any
}

export default function PaymentInstructions({ reservation }: PaymentInstructionsProps) {
  const { language } = useTheme()

  // Validation minimale
// Validation correcte selon les nouvelles données
const isValid =
  reservation &&
  typeof reservation.id === "string" &&
  typeof reservation.nom === "string" && 
  reservation.nom.trim().length > 0 &&
  typeof reservation.telephone === "string" &&
  reservation.telephone.trim().length > 0 &&
  reservation.totalPrice > 0


  if (!isValid) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-[#854D0E]/10 border border-[#854D0E] rounded-lg p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-8 h-8 text-[#FACC15]" />
            <h3 className="text-xl md:text-2xl font-bold text-[#f8f8f8]">
              Erreur de réservation
            </h3>
          </div>

          <p className="text-[#cccccc] mb-4">
            Les données reçues sont incomplètes.
          </p>

          <div className="bg-[#0a0a0a] rounded p-4 text-xs text-[#999999] font-mono">
            <p>Données reçues :</p>
            <pre>{JSON.stringify(reservation, null, 2)}</pre>
          </div>

          <button
            onClick={() => window.location.href = "/reservation"}
            className="mt-6 w-full bg-[#854D0E] hover:bg-[#cc0000] text-white py-3 rounded-lg font-semibold"
          >
            Recommencer la réservation
          </button>
        </div>
      </div>
    )
  }

  // Champs propres
  const reservationId = reservation.id
  const reservantName = reservation.nom // FULL NAME now
  const packName = reservation.packName || "Pack inconnu"
  const phone = reservation.telephone
  const email = reservation.email || "-"
  const totalAmount = reservation.totalPrice
  const participants = reservation.participants ?? []

  // WhatsApp message final
  const whatsappMessage =
    `Bonjour, je viens d'effectuer une réservation pour Movie in the Park.\n` +
    `Nom : ${reservantName}\n` +
    `Téléphone : ${phone}\n` +
    `Email : ${email}\n` +
    `Pack choisi : ${packName}\n` +
    `Montant : ${totalAmount.toLocaleString("fr-FR")} XAF\n` +
    `Numéro de réservation : ${reservationId}\n\n` +
    `Je vous envoie ci-joint ma preuve de paiement. Merci.`

  const whatsappLink = `https://wa.me/237697304450?text=${encodeURIComponent(whatsappMessage)}`

  return (
    <div className="max-w-3xl mx-auto space-y-12">

      {/* SUCCESS MESSAGE */}
      <div className="text-center">
        <CheckCircle className="w-16 h-16 text-[#854D0E] mx-auto mb-4" />
        <h2 className="text-4xl font-bold text-[#f8f8f8] mb-2">
          Réservation confirmée !
        </h2>
        <p className="text-lg text-[#cccccc]">
          Votre réservation <span className="text-[#FACC15] font-bold">#{reservationId}</span> a été prise en compte.
        </p>
      </div>

      {/* RESERVATION DETAILS */}
      <div className="bg-[#121212] rounded-lg p-8 border border-[#333333]">
        <h3 className="text-2xl font-bold text-[#f8f8f8] mb-6">
          Détails de votre réservation
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-[#999] uppercase mb-2">Numéro de réservation</p>
            <p className="text-2xl font-bold text-[#FACC15]">{reservationId}</p>
          </div>

          <div>
            <p className="text-xs text-[#999] uppercase mb-2">Pack</p>
            <p className="text-2xl font-bold text-white">{packName}</p>
          </div>

          <div>
            <p className="text-xs text-[#999] uppercase mb-2">Montant à payer</p>
            <p className="text-2xl font-bold text-[#854D0E]">
              {totalAmount.toLocaleString("fr-FR")} XAF
            </p>
          </div>

          <div>
            <p className="text-xs text-[#999] uppercase mb-2">Réservant</p>
            <p className="text-xl text-white">{reservantName}</p>
          </div>
        </div>
      </div>

      {/* PAYMENT INSTRUCTIONS */}
      <div className="bg-gradient-to-br from-[#1a0a0a] to-[#0a0a0a] rounded-lg p-8 border border-[#854D0E]">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <Smartphone className="w-6 h-6 text-[#854D0E]" />
          Instructions de paiement
        </h3>

        {/* STEP 1 */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-white mb-3">Étape 1 : Effectuez votre paiement</h4>

          <div className="bg-[#0a0a0a] p-6 rounded-lg border border-[#333]">
            <p className="text-[#ccc] mb-4">
              Veuillez effectuer un virement Mobile Money sur le compte suivant :
            </p>

            <p className="text-[#999] text-sm">Opérateur</p>
            <p className="text-white font-bold mb-3">MTN Mobile Money / Orange Money</p>

            <p className="text-[#999] text-sm">Numéro</p>
            <p className="text-[#FACC15] font-bold text-xl mb-3">
              +237 697 30 44 50
            </p>

            <p className="text-[#999] text-sm">Montant</p>
            <p className="text-[#854D0E] text-2xl font-bold">
              {totalAmount.toLocaleString("fr-FR")} XAF
            </p>
          </div>
        </div>

        {/* STEP 2 */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-3">Étape 2 : Envoyez votre preuve de paiement</h4>

          <p className="text-[#ccc] mb-4">
            Cliquez sur le bouton ci-dessous pour confirmer vos informations auprès de notre équipe.
            Puis vous allez proceder au paiement et envoyer la preuve via WhatsApp.
          </p>

          <a
            href={whatsappLink}
            target="_blank"
            className="block bg-[#25d366] hover:bg-[#20ba5a] text-white text-center py-4 rounded-lg font-semibold"
          >
            Confirmez votre réservation via WhatsApp
          </a>
        </div>

        {/* PREFILLED MESSAGE */}
        <div className="bg-[#0a0a0a] border border-[#333] p-4 rounded-lg mt-6">
          <h4 className="text-white font-semibold mb-3">Votre message pré-rempli :</h4>
          <pre className="text-[#ccc] text-sm whitespace-pre-wrap">{whatsappMessage}</pre>
        </div>
      </div>

      {/* NEXT STEPS */}
      <div className="bg-[#121212] p-8 border border-[#333] rounded-lg">
        <h3 className="text-2xl font-bold text-white mb-6">
          Qu'est-ce qui se passe ensuite ?
        </h3>

        <div className="space-y-4">
          {[
            {
              title: "Paiement en attente de vérification",
              desc: "Votre paiement sera vérifié par un administrateur.",
            },
            {
              title: "Confirmation par WhatsApp",
              desc: "Vous recevrez votre ticket numérique par WhatsApp.",
            },
            {
              title: "Email de confirmation",
              desc: `Un email récapitulatif sera envoyé à ${email}.`,
            },
            {
              title: "Profitez de l'évènement !",
              desc: "Présentez votre ticket numérique à l'entrée.",
            },
          ].map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-10 h-10 bg-[#854D0E] text-white rounded-full flex items-center justify-center font-bold">
                {i + 1}
              </div>

              <div>
                <p className="text-white font-semibold">{step.title}</p>
                <p className="text-[#ccc]">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* INFO */}
      <div className="bg-[#1a0a0a] p-6 border border-[#333] rounded-lg text-center">
        <p className="text-[#ccc]">
          {t("paymentInstructions.infoMessage", language)}{" "}
          <a href="/" className="text-[#854D0E] hover:text-[#FACC15] font-semibold">
            {t("paymentInstructions.homepage", language)}
          </a>
        </p>
      </div>
    </div>
  )
}
