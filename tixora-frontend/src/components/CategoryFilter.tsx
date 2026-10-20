import type { Filter } from '../types/event.ts'

const FILTERS: Filter[] = ['All', 'Music', 'Tech', 'Comedy', 'Theatre']

interface CategoryFilterProps {
  value: Filter
  onChange: (filter: Filter) => void
}

export default function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <div
      className="flex flex-wrap gap-2"
      role="group"
      aria-label="Filter events by category"
    >
      {FILTERS.map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          aria-pressed={value === f}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 ${
            value === f
              ? 'bg-violet-500 text-white'
              : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  )
}