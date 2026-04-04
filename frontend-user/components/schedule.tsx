interface ScheduleItem {
  time: string
  title: string
  description: string
  isSurprise?: boolean
  isAfter?: boolean
  isTeaser?: boolean
  category?: "enfants" | "encadrants" | string
}

const CATEGORY_LABELS: Record<string, { label: string; color: string; bg: string; border: string }> = {
  enfants: {
    label: "🧒 Axe Activités Enfants Orphelins",
    color: "#86EFAC",
    bg: "rgba(134,239,172,0.08)",
    border: "rgba(134,239,172,0.25)",
  },
  encadrants: {
    label: "👥 Axe Activités Encadrants",
    color: "#93C5FD",
    bg: "rgba(147,197,253,0.08)",
    border: "rgba(147,197,253,0.25)",
  },
}

export default function Schedule({ items }: { items: ScheduleItem[] }) {
  // Track which category headers have already been rendered
  const renderedCategories = new Set<string>()

  return (
    <div className="space-y-1">
      {items.map((item, index) => {
        // Render a category header the first time we encounter a new category
        const showCategoryHeader =
          item.category &&
          CATEGORY_LABELS[item.category] &&
          !renderedCategories.has(item.category)

        if (showCategoryHeader && item.category) {
          renderedCategories.add(item.category)
        }

        const catStyle = item.category ? CATEGORY_LABELS[item.category] : null

        return (
          <div key={index}>
            {/* Category section header */}
            {showCategoryHeader && catStyle && (
              <div
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl mb-2 mt-4 text-sm font-semibold"
                style={{
                  background: catStyle.bg,
                  border: `1px solid ${catStyle.border}`,
                  color: catStyle.color,
                }}
              >
                {catStyle.label}
              </div>
            )}

            {/* Schedule item */}
            <div
              className="schedule-item flex gap-6 p-6 rounded-lg transition-colors group"
              style={catStyle ? { borderLeft: `2px solid ${catStyle.border}`, paddingLeft: "1.25rem" } : undefined}
            >
              <div className="flex items-start gap-4 flex-1">

                {/* Heure */}
                <div className="flex-shrink-0">
                  <div className="schedule-time text-2xl font-bold min-w-24">{item.time}</div>
                </div>

                {/* Ligne verticale + point */}
                <div className="flex flex-col items-center -ml-2">
                  <div
                    className="schedule-dot w-4 h-4 rounded-full mt-2 transition-colors"
                    style={catStyle ? { background: catStyle.color, opacity: 0.7 } : undefined}
                  />
                  {index !== items.length - 1 && (
                    <div className="schedule-line w-1 flex-grow my-4 transition-colors" />
                  )}
                </div>

                {/* Contenu */}
                <div className="flex-1 pt-1">
                  <h4 className="schedule-title text-xl font-bold mb-1">{item.title}</h4>
                  <p className="schedule-desc">{item.description}</p>
                  {item.category && (
                    <span
                      className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={catStyle ? { background: catStyle.bg, color: catStyle.color, border: `1px solid ${catStyle.border}` } : undefined}
                    >
                      Détails à venir
                    </span>
                  )}
                  {item.isTeaser && (
                    <p className="schedule-teaser italic mt-2 text-sm">
                      Un contenu spécial non annoncé pourrait être diffusé en fin de soirée…
                    </p>
                  )}
                </div>
              </div>
            </div>

            {item.isSurprise && (
              <div className="schedule-extra-item flex gap-6 p-6 rounded-lg mt-1">
                <div className="flex items-start gap-4 flex-1 ml-14">
                  <div className="flex-1">
                    <h4 className="schedule-title text-xl font-bold mb-1">✨ Moments surprises de la soirée</h4>
                    <p className="schedule-desc">
                      Deux animations exclusives seront révélées uniquement aux participants. Préparez-vous à vivre une expérience inattendue.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {item.isAfter && (
              <div className="schedule-extra-item flex gap-6 p-6 rounded-lg mt-1">
                <div className="flex items-start gap-4 flex-1 ml-14">
                  <div className="flex-1">
                    <h4 className="schedule-title text-xl font-bold mb-1">
                      🌙 After Midnight – pour ceux qui veulent prolonger la soirée
                    </h4>
                    <p className="schedule-desc">
                      Après 00h00, une session after est prévue avec musique, détente et ambiance chill pour ceux qui souhaitent rester.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
