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
          <div className="flex gap-6 p-6 bg-[#0a0a0a] rounded-lg hover:bg-[#1a1a1a] transition-colors group">
            <div className="flex items-start gap-4 flex-1">
              {/* Time */}
              <div className="flex-shrink-0">
                <div className="text-2xl font-bold text-[#dc143c] min-w-24">{item.time}</div>
              </div>

              {/* Vertical line and dot */}
              <div className="flex flex-col items-center -ml-2">
                <div className="w-4 h-4 bg-[#a00000] rounded-full mt-2 group-hover:bg-[#dc143c] transition-colors" />
                {index !== items.length - 1 && (
                  <div className="w-1 bg-[#333333] flex-grow my-4 group-hover:bg-[#666666] transition-colors" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pt-1">
                <h4 className="text-xl font-bold text-[#f8f8f8] mb-1">{item.title}</h4>
                <p className="text-[#999999]">{item.description}</p>
                {item.isTeaser && (
                  <p className="text-[#999999] italic mt-2 text-sm">
                    Un contenu spécial non annoncé pourrait être diffusé en fin de soirée…
                  </p>
                )}
              </div>
            </div>
          </div>

          {item.isSurprise && (
            <div className="flex gap-6 p-6 bg-[#1a1a1a] rounded-lg mt-1 hover:bg-[#222222] transition-colors">
              <div className="flex items-start gap-4 flex-1 ml-14">
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-[#f8f8f8] mb-1">✨ Moments surprises de la soirée</h4>
                  <p className="text-[#999999]">
                    Deux animations exclusives seront révélées uniquement aux participants. Préparez-vous à vivre une
                    expérience inattendue.
                  </p>
                </div>
              </div>
            </div>
          )}

          {item.isAfter && (
            <div className="flex gap-6 p-6 bg-[#1a1a1a] rounded-lg mt-1 hover:bg-[#222222] transition-colors">
              <div className="flex items-start gap-4 flex-1 ml-14">
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-[#f8f8f8] mb-1">
                    🌙 After Midnight – pour ceux qui veulent prolonger la soirée
                  </h4>
                  <p className="text-[#999999]">
                    Après 00h00, une session after est prévue avec musique, détente et ambiance chill pour ceux qui
                    souhaitent rester.
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
