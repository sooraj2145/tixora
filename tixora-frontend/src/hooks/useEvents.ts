import { useCallback, useEffect, useState } from 'react'
import { fetchEvents } from '../api/eventApi'
import { mapApiEvent } from '../lib/mapApiEvent'
import type { EventItem } from '../types/event'

export function useEvents() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true

    fetchEvents()
      .then((page) => {
        if (!active) return
        setEvents(
          page.content
            .filter((event) => event.status === 'PUBLISHED')
            .map(mapApiEvent),
        )
        setError(null)
      })
      .catch((err) => {
        if (!active) return
        console.error('Failed to load events:', err)
        setError('Unable to load events. Please try again later.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [attempt])

  const retry = useCallback(() => {
    setLoading(true)
    setError(null)
    setAttempt((n) => n + 1)
  }, [])

  return { events, loading, error, retry }
}