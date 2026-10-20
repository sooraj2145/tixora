export default function HeroTicket() {
  return (
    <div
      className="relative mx-auto w-full max-w-md rotate-2 select-none"
      aria-hidden="true"
    >
      <div className="flex overflow-hidden rounded-3xl bg-[#e9e3ff] text-[#17132b] shadow-2xl shadow-violet-950/60">
        <div className="flex-1 p-7">
          <p className="text-sm font-medium text-violet-700">Tixora Live</p>
          <h3 className="font-display mt-3 text-3xl font-bold leading-tight">
            Midnight Frequencies
          </h3>
          <p className="mt-2 text-sm text-[#17132b]/70">
            Sat 21 Nov, doors 7:00 pm
          </p>

          <dl className="mt-8 grid grid-cols-3 gap-4 text-sm">
            {[
              ['Section', 'B'],
              ['Row', '4'],
              ['Seat', '12'],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-[#17132b]/60">{label}</dt>
                <dd className="font-display text-lg font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative flex w-24 flex-col items-center justify-center gap-3 border-l-2 border-dashed border-[#17132b]/25 bg-violet-500 p-4 text-white">
          <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-[#0c0a1a]" />
          <span className="absolute -bottom-3 -left-3 h-6 w-6 rounded-full bg-[#0c0a1a]" />
          <span className="font-display rotate-180 text-lg font-bold [writing-mode:vertical-rl]">
            Admit one
          </span>
        </div>
      </div>
    </div>
  )
}