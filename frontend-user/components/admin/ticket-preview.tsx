"use client"

import { useEffect, useRef, useState } from "react"
import { Download, Loader2, AlertCircle, Sparkles } from "lucide-react"

interface TicketPreviewProps {
  ticketNumber: string
  qrDataUrl: string
  qrImageUrl?: string
  packName: string
  reservationId: string
  onClose?: () => void
}

export function TicketPreview({
  ticketNumber,
  qrDataUrl,
  packName,
  reservationId,
  onClose,
}: TicketPreviewProps) {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading]   = useState(true)
  const [error, setError]           = useState<string | null>(null)

  const getTemplateImage = (pack: string): string => {
    if (!pack) return "/simple.jpg"
    const name = pack.toLowerCase()
    if (name.includes("vip"))                               return "/vip.jpg"
    if (name.includes("famille") || name.includes("family")) return "/famille.jpg"
    if (name.includes("couple"))                            return "/couple.jpg"
    return "/simple.jpg"
  }

  useEffect(() => {
    const generatePreview = async () => {
      if (!canvasRef.current) return

      setIsLoading(true)
      setError(null)

      try {
        const ctx = canvasRef.current.getContext("2d")
        if (!ctx) throw new Error("Could not get canvas context")

        // Load images
        const templateSrc = getTemplateImage(packName)
        const templateImg = new Image()
        templateImg.crossOrigin = "anonymous"
        templateImg.src = templateSrc

        const qrImg = new Image()
        qrImg.crossOrigin = "anonymous"
        qrImg.src = qrDataUrl

        await Promise.all([
          new Promise<void>((resolve, reject) => {
            templateImg.onload  = () => resolve()
            templateImg.onerror = () => reject(new Error("Failed to load template image"))
          }),
          new Promise<void>((resolve, reject) => {
            qrImg.onload  = () => resolve()
            qrImg.onerror = () => reject(new Error("Failed to load QR code"))
          }),
        ])

        // Canvas dimensions
        const width  = templateImg.naturalWidth  || templateImg.width  || 1200
        const height = templateImg.naturalHeight || templateImg.height || 400

        canvasRef.current.width  = width
        canvasRef.current.height = height

        // Draw template
        ctx.drawImage(templateImg, 0, 0, width, height)

        // ── Golden Easter overlay ───────────────────────────────────────────
        // Dark vignette for readability
        const vignette = ctx.createRadialGradient(
          width / 2, height / 2, height * 0.2,
          width / 2, height / 2, height * 0.85
        )
        vignette.addColorStop(0, "rgba(0,0,0,0)")
        vignette.addColorStop(1, "rgba(0,0,0,0.45)")
        ctx.fillStyle = vignette
        ctx.fillRect(0, 0, width, height)

        // Golden border frame
        const borderW = Math.floor(width * 0.006)
        ctx.strokeStyle = "#FACC15"
        ctx.lineWidth   = borderW
        ctx.globalAlpha = 0.75
        const inset = borderW * 3
        const bRadius = Math.floor(height * 0.07)
        ctx.beginPath()
        ctx.moveTo(inset + bRadius, inset)
        ctx.arcTo(width - inset, inset, width - inset, inset + bRadius, bRadius)
        ctx.arcTo(width - inset, height - inset, width - inset - bRadius, height - inset, bRadius)
        ctx.arcTo(inset, height - inset, inset, height - inset - bRadius, bRadius)
        ctx.arcTo(inset, inset, inset + bRadius, inset, bRadius)
        ctx.closePath()
        ctx.stroke()
        ctx.globalAlpha = 1

        // Inner golden corner accents
        const accentLen = Math.floor(width * 0.06)
        const accentOff = inset + borderW
        ctx.strokeStyle = "#CA8A04"
        ctx.lineWidth   = borderW * 1.5
        ctx.globalAlpha = 0.9

        const corners: [number, number, number, number, number, number][] = [
          [accentOff, accentOff, accentOff + accentLen, accentOff, accentOff, accentOff + accentLen],
          [width - accentOff, accentOff, width - accentOff - accentLen, accentOff, width - accentOff, accentOff + accentLen],
          [accentOff, height - accentOff, accentOff + accentLen, height - accentOff, accentOff, height - accentOff - accentLen],
          [width - accentOff, height - accentOff, width - accentOff - accentLen, height - accentOff, width - accentOff, height - accentOff - accentLen],
        ]
        corners.forEach(([x, y, x2, y2, x3, y3]) => {
          ctx.beginPath()
          ctx.moveTo(x, y)
          ctx.lineTo(x2, y2)
          ctx.moveTo(x, y)
          ctx.lineTo(x3, y3)
          ctx.stroke()
        })
        ctx.globalAlpha = 1

        // ── QR Code ─────────────────────────────────────────────────────────
        const qrSize = Math.floor(Math.min(width, height) * 0.22)
        const qrX    = width - qrSize - Math.floor(width * 0.04)
        const qrY    = Math.floor(height * 0.08)

        // QR white backdrop with rounded corners
        const qrPad  = Math.floor(qrSize * 0.06)
        const qrBack = Math.floor(qrSize * 0.1)
        ctx.fillStyle = "rgba(255,255,255,0.92)"
        ctx.beginPath()
        ctx.roundRect(qrX - qrPad, qrY - qrPad, qrSize + qrPad * 2, qrSize + qrPad * 2, qrBack)
        ctx.fill()

        // Golden QR border
        ctx.strokeStyle = "#FACC15"
        ctx.lineWidth   = Math.floor(qrSize * 0.025)
        ctx.globalAlpha = 0.85
        ctx.beginPath()
        ctx.roundRect(qrX - qrPad, qrY - qrPad, qrSize + qrPad * 2, qrSize + qrPad * 2, qrBack)
        ctx.stroke()
        ctx.globalAlpha = 1

        ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize)

        // ── Ticket number box ────────────────────────────────────────────────
        const boxWidth  = Math.floor(width * 0.37)
        const boxHeight = Math.floor(height * 0.19)
        const boxX      = width - boxWidth - Math.floor(width * 0.04)
        const boxY      = height - boxHeight - Math.floor(height * 0.06)
        const boxR      = Math.floor(boxHeight * 0.18)

        // Glassmorphism dark bg
        ctx.fillStyle = "rgba(8,8,16,0.72)"
        ctx.beginPath()
        ctx.roundRect(boxX, boxY, boxWidth, boxHeight, boxR)
        ctx.fill()

        // Golden border on number box
        ctx.strokeStyle = "rgba(250,204,21,0.6)"
        ctx.lineWidth   = Math.floor(height * 0.007)
        ctx.beginPath()
        ctx.roundRect(boxX, boxY, boxWidth, boxHeight, boxR)
        ctx.stroke()

        // Ticket number text
        const fontSize = Math.floor(boxHeight * 0.36)
        ctx.fillStyle   = "#FACC15"
        ctx.font        = `900 ${fontSize}px Inter, system-ui, sans-serif`
        ctx.textAlign   = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(ticketNumber, boxX + boxWidth / 2, boxY + boxHeight / 2 - fontSize * 0.1)

        // Reservation ID subtext
        ctx.fillStyle = "rgba(255,255,255,0.65)"
        ctx.font      = `${Math.floor(boxHeight * 0.19)}px Inter, system-ui, sans-serif`
        ctx.fillText(
          `#${reservationId.slice(0, 8).toUpperCase()}`,
          boxX + boxWidth / 2,
          boxY + boxHeight / 2 + fontSize * 0.6
        )

        // ── Easter watermark ─────────────────────────────────────────────────
        ctx.globalAlpha = 0.08
        ctx.fillStyle   = "#FACC15"
        ctx.font        = `bold ${Math.floor(height * 0.12)}px Inter, system-ui, sans-serif`
        ctx.textAlign   = "left"
        ctx.textBaseline = "bottom"
        ctx.fillText("PÂQUES 2026", Math.floor(width * 0.03), height - Math.floor(height * 0.05))
        ctx.globalAlpha = 1

        const dataUrl = canvasRef.current.toDataURL("image/png")
        setPreviewUrl(dataUrl)
      } catch (err) {
        console.error("[TicketPreview] Error:", err)
        setError(err instanceof Error ? err.message : "Failed to generate ticket preview")
      } finally {
        setIsLoading(false)
      }
    }

    generatePreview()
  }, [ticketNumber, qrDataUrl, packName, reservationId])

  const handleDownload = () => {
    if (!previewUrl) return
    const link      = document.createElement("a")
    link.href       = previewUrl
    link.download   = `ticket_paques_${ticketNumber}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-4">
      {/* Hidden canvas */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {isLoading ? (
        <div
          className="flex items-center justify-center w-full rounded-xl"
          style={{
            height: 240,
            background: "rgba(250,204,21,0.04)",
            border: "1px solid rgba(250,204,21,0.15)",
          }}
        >
          <div className="text-center space-y-2">
            <Loader2
              className="w-8 h-8 mx-auto animate-spin"
              style={{ color: "#FACC15" }}
            />
            <p className="text-sm" style={{ color: "#CCCCBB" }}>
              Génération du ticket d&apos;or…
            </p>
          </div>
        </div>
      ) : error ? (
        <div
          className="p-4 rounded-xl flex items-start gap-3"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.25)",
          }}
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#FCA5A5" }} />
          <p className="text-sm" style={{ color: "#FCA5A5" }}>
            {error}
          </p>
        </div>
      ) : previewUrl ? (
        <div className="space-y-3">
          {/* Ticket preview wrapper */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              border: "1px solid rgba(250,204,21,0.3)",
              boxShadow: "0 4px 24px rgba(250,204,21,0.1), 0 2px 8px rgba(0,0,0,0.4)",
              background: "#080810",
            }}
          >
            {/* Header strip */}
            <div
              className="flex items-center justify-between px-4 py-2.5"
              style={{
                background: "linear-gradient(90deg, rgba(250,204,21,0.12) 0%, rgba(202,138,4,0.08) 100%)",
                borderBottom: "1px solid rgba(250,204,21,0.2)",
              }}
            >
              <div className="flex items-center gap-2">
                <Sparkles size={14} style={{ color: "#FACC15" }} />
                <span
                  className="text-xs font-semibold tracking-widest uppercase"
                  style={{ color: "#FACC15" }}
                >
                  Ticket d&apos;Or · Pâques 2026
                </span>
              </div>
              <span className="text-xs font-mono" style={{ color: "#888877" }}>
                #{reservationId.slice(0, 8).toUpperCase()}
              </span>
            </div>

            <img
              src={previewUrl}
              alt="Ticket Preview"
              className="w-full h-auto block"
            />
          </div>

          {/* Download button */}
          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02]"
            style={{
              background: "linear-gradient(135deg, #FACC15 0%, #CA8A04 100%)",
              color: "#080810",
              boxShadow: "0 4px 14px rgba(250,204,21,0.3)",
            }}
          >
            <Download className="w-4 h-4" />
            Télécharger le ticket PNG
          </button>
        </div>
      ) : null}
    </div>
  )
}
