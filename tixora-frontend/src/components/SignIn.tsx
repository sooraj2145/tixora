import { useState, type SubmitEvent } from "react";
import { login } from "../api/eventApi";
import { focusRing } from "../lib/styles";

interface SignInProps {
  onBack: () => void;
  onLogin: (name: string) => void;
  onRegister?: () => void;
}

export default function SignIn({ onBack, onLogin, onRegister }: SignInProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await login(email, password);
      onLogin(response.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-md px-6 py-20">
      <button
        type="button"
        onClick={onBack}
        className={`mb-8 text-sm font-semibold text-violet-300 hover:text-violet-200 ${focusRing}`}
      >
        ← Back to events
      </button>

      <div className="rounded-2xl bg-[#17132b] p-8 ring-1 ring-white/10">
        <h2 className="font-display text-3xl font-bold">Welcome back</h2>
        <p className="mt-2 text-slate-400">Sign in to book your tickets.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#0c0a1a] px-4 py-3 text-white outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#0c0a1a] px-4 py-3 text-white outline-none focus:ring-2 focus:ring-violet-400"
            />
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
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onRegister}
            className={`font-semibold text-violet-300 hover:text-violet-200 ${focusRing}`}
          >
            Create account
          </button>
        </p>
      </div>
    </section>
  );
}
