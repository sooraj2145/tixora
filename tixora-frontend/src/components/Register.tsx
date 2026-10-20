import { useState, type SubmitEvent } from 'react'
import { register } from '../api/eventApi.ts'
import { focusRing } from '../lib/styles.ts'


interface RegisterProps {
    onBack: () => void
    onRegistered: () => void
}

export default function Register({ onBack, onRegistered }: RegisterProps) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            await register(name.trim(), email.trim(), password)
            onRegistered()
        } catch (err) {
            setError(
err instanceof Error ? err.message : 'Unable to register your account.',
)
        } finally {
            setLoading(false)
        }
    }

    return (
            <section className="mx-auto max-w-md px-6 py-20">
      <button
        type="button"
        onClick={onBack}
        className={`mb-8 text-sm font-semibold text-violet-300 hover:text-violet-200 ${focusRing}`}
      >
        ← Back
      </button>

      <div className="rounded-2xl bg-[#17132b] p-8 ring-1 ring-white/10">
        <h2 className="font-display text-3xl font-bold">Create account</h2>
        <p className="mt-2 text-slate-400">
          Join Tixora to book your next experience.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="register-name" className="mb-2 block text-sm font-medium">
              Full name
            </label>
            <input
              id="register-name"
              required
              maxLength={100}
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#0c0a1a] px-4 py-3 text-white outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

          <div>
            <label htmlFor="register-email" className="mb-2 block text-sm font-medium">
              Email
            </label>
            <input
              id="register-email"
              type="email"
              required
              maxLength={150}
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#0c0a1a] px-4 py-3 text-white outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

          <div>
            <label htmlFor="register-password" className="mb-2 block text-sm font-medium">
              Password
            </label>
            <input
              id="register-password"
              type="password"
              required
              minLength={8}
              maxLength={72}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#0c0a1a] px-4 py-3 text-white outline-none focus:ring-2 focus:ring-violet-400"
            />
            <p className="mt-2 text-xs text-slate-400">
              Use 8–72 characters.
            </p>
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-lg bg-violet-500 px-6 py-3 font-semibold transition-colors hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </div>
    </section>
  )
}