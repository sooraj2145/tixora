import { useEffect, useState, type ReactNode } from "react";
import {
  fetchEventById,
  createBooking,
  type ApiEvent,
  type BookingResponse,
} from "../api/eventApi";
import type { EventItem } from "../types/event";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#17132b]";

interface EventDetailsProps {
  event: EventItem;
  onBack: () => void;
  onSignIn: () => void;
}

export default function EventDetails({
  event,
  onBack,
  onSignIn,
}: EventDetailsProps) {
  const [fullEvent, setFullEvent] = useState<ApiEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [booking, setBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingConfirmation, setBookingConfirmation] =
    useState<BookingResponse | null>(null);

  useEffect(() => {
    let active = true;

    fetchEventById(event.id)
      .then((data) => {
        if (active) setFullEvent(data);
      })
      .catch(() => {
        if (active)
          setError("Unable to load event details. Please try again later.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [event.id]);

 async function handleBooking() {
  setBooking(true);
  setBookingError(null);
  setBookingConfirmation(null);

  try {
    const result = await createBooking(event.id, quantity);
    setBookingConfirmation(result);

    const updatedEvent = await fetchEventById(event.id);
    setFullEvent(updatedEvent);
    setQuantity(1);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unable to book tickets.";

    if (message.includes("401") || message.includes("403")) {
      onSignIn();
      return;
    }

    setBookingError(message);
  } finally {
    setBooking(false);
  }
}
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <button
        onClick={onBack}
        className={`mb-8 text-sm font-semibold text-violet-300 hover:text-violet-200 ${focusRing}`}
      >
        ← Back to events
      </button>

      {loading ? (
        <p className="text-slate-400">Loading event details...</p>
      ) : error || !fullEvent ? (
        <p className="text-red-300">
          {error ?? "Event details are unavailable."}
        </p>
      ) : (
        <article className="rounded-2xl bg-[#17132b] p-8 ring-1 ring-white/10">
          <p className="text-sm font-medium text-violet-300">
            {event.category}
          </p>
          <h2 className="font-display mt-3 text-4xl font-bold tracking-tight">
            {fullEvent.title}
          </h2>
          <p className="mt-5 leading-7 text-slate-400">
            {fullEvent.description || "No description available."}
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <Detail label="Date and time">
              {new Date(fullEvent.startTime).toLocaleString("en-IN", {
                dateStyle: "full",
                timeStyle: "short",
              })}
            </Detail>
            <Detail label="Venue">
              {fullEvent.venue}, {fullEvent.city}
            </Detail>
            <Detail label="Ticket price">
              <span className="font-display text-2xl font-bold">
                ₹{Number(fullEvent.ticketPrice).toLocaleString("en-IN")}
              </span>
            </Detail>
            <Detail label="Tickets available">
              {fullEvent.availableCapacity}
            </Detail>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <label htmlFor="ticket-quantity" className="text-sm font-medium">
              Tickets
            </label>

            <select
              id="ticket-quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="rounded-lg border border-white/10 bg-[#0c0a1a] px-3 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
            >
              {Array.from(
                { length: Math.min(10, fullEvent.availableCapacity) },
                (_, i) => i + 1,
              ).map((count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
            </select>

            <button
              disabled={booking || fullEvent.availableCapacity === 0}
              className={`rounded-lg bg-violet-500 px-6 py-3 font-semibold transition-colors hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`}
              onClick={handleBooking}
            >
              {fullEvent.availableCapacity === 0
                ? "Sold out"
                : booking
                  ? "Booking..."
                  : "Book tickets"}
            </button>

            {bookingError && (
              <p role="alert" className="mt-4 text-sm text-red-300">
                {bookingError}
              </p>
            )}

            {bookingConfirmation && (
              <div className="mt-6 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-5">
                <h3 className="font-semibold text-emerald-300">
                  Booking confirmed!
                </h3>
                <p className="mt-2 text-sm text-slate-300">
                  Booking ID: {bookingConfirmation.id}
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  Tickets: {bookingConfirmation.quantity}
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  Total: ₹
                  {Number(bookingConfirmation.totalAmount).toLocaleString(
                    "en-IN",
                  )}
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  Status: {bookingConfirmation.status}
                </p>
              </div>
            )}
          </div>
        </article>
      )}
    </section>
  );
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-1 font-semibold">{children}</p>
    </div>
  );
}
