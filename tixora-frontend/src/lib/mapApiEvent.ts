import type { ApiEvent } from '../api/eventApi'
import type { Category, EventItem } from '../types/event.ts'

const categoryMap: Record<ApiEvent['category'], Category> = {
  MUSIC: 'Music',
  TECH: 'Tech',
  COMEDY: 'Comedy',
  THEATRE: 'Theatre',
}

export function mapApiEvent(event: ApiEvent): EventItem {
  const date = new Date(event.startTime)

  return {
    id: event.id,
    title: event.title,
    category: categoryMap[event.category],
    month: date.toLocaleString('en-US', { month: 'short' }),
    day: date.toLocaleString('en-US', { day: '2-digit' }),
    venue: event.venue,
    city: event.city,
    price: Number(event.ticketPrice),
  }
}