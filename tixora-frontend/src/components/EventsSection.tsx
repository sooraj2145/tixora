import type { EventItem, Filter } from '../types/event.ts'
import CategoryFilter from './CategoryFilter'
import TicketCard from './TicketCard.tsx'

interface EventsSectionProps {
  events: EventItem[]
  loading: boolean
  error: string | null
  filter: Filter
  onFilterChange: (filter: Filter) => void
  onSelect: (event: EventItem) => void
  onRetry: () => void
}

export default function EventsSection({
  events,
  loading,
  error,
  filter,
  onFilterChange,
  onSelect,
  onRetry,
}: EventsSectionProps) {
  const visible =
    filter === 'All' ? events : events.filter((e) => e.category === filter)

  return (
    <section id="events" className="scroll-mt-16 border-t border-white/10">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="font-display text-3xl font-bold tracking-tight">
              Upcoming events
            </h3>
            <p className="mt-2 text-slate-400">
              Pick a category to narrow the list.
            </p>
          </div>
          <CategoryFilter value={filter} onChange={onFilterChange} />
        </div>

        {loading ? (
          <p className="mt-10 text-slate-400">Loading events...</p>
        ) : error ? (
          <div className="mt-10 rounded-2xl border border-red-400/20 p-8">
            <p className="text-red-300">{error}</p>
            <button
              onClick={onRetry}
              className="mt-4 text-sm font-semibold text-violet-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Try again
            </button>
          </div>
        ) : visible.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((event) => (
              <TicketCard key={event.id} event={event} onSelect={onSelect} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-white/20 p-12 text-center">
            <p className="text-slate-300">
              {events.length === 0
                ? 'No published events available yet.'
                : `No ${filter.toLowerCase()} events yet.`}
            </p>
            {filter !== 'All' && (
              <button
                onClick={() => onFilterChange('All')}
                className="mt-4 text-sm font-semibold text-violet-300 hover:text-violet-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                Show all events
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}