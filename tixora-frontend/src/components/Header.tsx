import { focusRing } from "../lib/styles.ts";

interface HeaderProps {
  onHome: () => void;
  onEvents: () => void;
  onSignIn: () => void;
  onSignOut?: () => void;
  userName: string | null;
}

export default function Header({
  onHome,
  onEvents,
  onSignIn,
  onSignOut,
  userName,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0c0a1a]/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <button
          onClick={onHome}
          className={`font-display text-xl font-bold tracking-tight sm:text-2xl ${focusRing}`}
        >
          Tixora<span className="text-violet-400">.</span>
        </button>

        <div className="flex items-center gap-3 text-sm sm:gap-6">
          <button
            onClick={onEvents}
            className={`text-slate-300 transition-colors hover:text-white ${focusRing}`}
          >
            Events
          </button>

          {userName ? (
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Box 1: welcome */}
              <div className="flex items-center gap-2.5 rounded-lg bg-white/5 px-3 py-2 ring-1 ring-white/10">
                <span
                  aria-hidden="true"
                  className="font-display flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/20 text-xs font-bold text-violet-300"
                >
                  {userName.charAt(0).toUpperCase()}
                </span>
                <span className="max-w-[7rem] truncate text-slate-300 sm:max-w-[12rem]">
                  <span className="hidden sm:inline">Welcome, </span>
                  <span className="font-semibold text-white">{userName}</span>
                </span>
              </div>

              {/* Box 2: sign out */}
              <button
                onClick={onSignOut}
                className={`rounded-lg px-4 py-2 font-semibold text-slate-200 ring-1 ring-white/20 transition-colors hover:bg-white/5 hover:text-white ${focusRing}`}
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={onSignIn}
              className={`rounded-lg bg-white px-4 py-2 font-semibold text-[#0c0a1a] transition-colors hover:bg-violet-200 ${focusRing}`}
            >
              Sign in
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}