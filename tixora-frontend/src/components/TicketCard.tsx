import { focusRing } from '../lib/styles.ts'
import type { EventItem } from '../types/event.ts'

interface TicketCardProps {
  event: EventItem
  onSelect: (event: EventItem) => void
}

export default function TicketCard({ event, onSelect }: TicketCardProps) {
  return (
    <article className="group relative flex flex-col rounded-2xl bg-[#17132b] ring-1 ring-white/10 transition-colors hover:ring-violet-400/60">
      <div className="flex gap-5 p-6">
        <div className="flex h-16 w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-violet-500/15 text-violet-300">
          <span className="text-xs font-medium">{event.month}</span>
          <span className="font-display text-2xl font-bold leading-none">
            {event.day}
          </span>
        </div>

        <div className="min-w-0">
          <p className="text-sm text-violet-300">{event.category}</p>
          <h4 className="font-display mt-1 text-xl font-semibold leading-snug">
            {/* The ::after stretches this button over the whole card,
                so the card is clickable and keyboard-accessible without
                nesting buttons. */}
            <button
              onClick={() => onSelect(event)}
              className={`text-left after:absolute after:inset-0 after:rounded-2xl ${focusRing}`}
            >
              {event.title}
            </button>
          </h4>
          <p className="mt-2 text-sm text-slate-400">
            {event.venue}, {event.city}
          </p>
        </div>
      </div>

      {/* Perforation */}
      <div className="relative">
        <span className="pointer-events-none absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[#0c0a1a]" />
        <span className="pointer-events-none absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[#0c0a1a]" />
        <div className="mx-6 border-t border-dashed border-white/15" />
      </div>

      <div className="flex items-center justify-between p-6">
        <p className="text-sm text-slate-400">
          From{' '}
          <span className="font-display text-xl font-semibold text-white">
            ₹{event.price.toLocaleString('en-IN')}
          </span>
        </p>

        <button
          onClick={() => onSelect(event)}
          className={`relative z-10 rounded-lg bg-violet-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-400 ${focusRing}`}
        >
          Get tickets
        </button>
      </div>
    </article>
  )
}