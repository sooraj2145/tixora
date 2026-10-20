import { focusRing } from '../lib/styles.ts'
import HeroTicket from './HeroTicket'

export default function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-16 px-6 py-20 lg:grid-cols-2 lg:py-28">
      <div>
        <h2 className="font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl">
          Tickets to the nights you'll still be talking about.
        </h2>

        <p className="mt-6 max-w-md text-lg leading-8 text-slate-400">
          Concerts, tech conferences, comedy and theatre. Pick an event, choose
          your seats, and you're in.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-4">
          <a
            href="#events"
            className={`rounded-lg bg-violet-500 px-6 py-3 font-semibold transition-colors hover:bg-violet-400 ${focusRing}`}
          >
            Browse events
          </a>
          <a
            href="#events"
            className={`rounded-lg px-6 py-3 font-semibold text-slate-200 ring-1 ring-white/20 transition-colors hover:bg-white/5 ${focusRing}`}
          >
            See what's on this month
          </a>
        </div>
      </div>

      <HeroTicket />
    </section>
  )
}