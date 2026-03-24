interface ScheduleItem {
  time: string
  title: string
  description: string
  isSurprise?: boolean
  isAfter?: boolean
  isTeaser?: boolean
}

export default function Schedule({ items }: { items: ScheduleItem[] }) {
  return (
    <div className="space-y-1">
      {items.map((item, index) => (
        <div key={index}>
          <div className="schedule-item flex gap-6 p-6 rounded-lg transition-colors group">
            <div className="flex items-start gap-4 flex-1">

              {/* Heure */}
              <div className="flex-shrink-0">
                <div className="schedule-time text-2xl font-bold min-w-24">{item.time}</div>
              </div>

              {/* Ligne verticale + point */}
              <div className="flex flex-col items-center -ml-2">
                <div className="schedule-dot w-4 h-4 rounded-full mt-2 transition-colors" />
                {index !== items.length - 1 && (
                  <div className="schedule-line w-1 flex-grow my-4 transition-colors" />
                )}
              </div>

              {/* Contenu */}
              <div className="flex-1 pt-1">
                <h4 className="schedule-title text-xl font-bold mb-1">{item.title}</h4>
                <p className="schedule-desc">{item.description}</p>
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
      ))}
    </div>
  )
}
