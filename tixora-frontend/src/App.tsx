
import { useEffect, useState } from 'react'
import EventDetails from './components/EventDetails'
import EventsSection from './components/EventsSection'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import { useEvents } from './hooks/useEvents'
import type { EventItem, Filter } from './types/event'
import SignIn from './components/SignIn'
import Register from './components/Register'
import {
  fetchCurrentUser,
  logout,
} from './api/eventApi'

function App() {
  const [filter, setFilter] = useState<Filter>('All')
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null)
  const { events, loading, error, retry } = useEvents()
  const [showRegister, setShowRegister] = useState(false)
  const [showSignIn, setShowSignIn] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    let active = true

    fetchCurrentUser()
      .then((user) => {
        if (active) {
          setUserName(user.name)
        }
      })
      .catch(() => {
        if (active) {
          setUserName(null)
        }
      })
      .finally(() => {
        if (active) {
          setAuthLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [])

  const handleLogin = (name: string) => {
    // The JWT is held in the HttpOnly cookie, not React state.
    setUserName(name)
    setShowSignIn(false)
  }

  const handleSignOut = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Sign out request failed:', error)
    } finally {
      setUserName(null)
      setShowSignIn(false)
      setShowRegister(false)
      setSelectedEvent(null)
      window.scrollTo({ top: 0 })
    }
  }

  const goHome = () => {
    setSelectedEvent(null)
    window.scrollTo({ top: 0 })
  }

  const goToEvents = () => {
    setSelectedEvent(null)
    setTimeout(
      () =>
        document
          .getElementById('events')
          ?.scrollIntoView({ behavior: 'smooth' }),
      0,
    )
  }

  const selectEvent = (event: EventItem) => {
    setSelectedEvent(event)
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="min-h-screen bg-[#0c0a1a] text-white antialiased">
      <Header
        onHome={goHome}
        onEvents={goToEvents}
        onSignIn={() => {
          setShowRegister(false)
          setShowSignIn(true)
        }}
        onSignOut={handleSignOut}
        userName={authLoading ? null : userName}
      />

      <main>
        {showRegister ? (
          <Register
            onBack={() => setShowRegister(false)}
            onRegistered={() => {
              setShowRegister(false)
              setShowSignIn(true)
            }}
          />
        ) : showSignIn ? (
          <SignIn
            onBack={() => setShowSignIn(false)}
            onLogin={handleLogin}
            onRegister={() => {
              setShowSignIn(false)
              setShowRegister(true)
            }}
          />
        ) : selectedEvent ? (
          <EventDetails
            key={selectedEvent.id}
            event={selectedEvent}
            onBack={goToEvents}
            onSignIn={() => {
              setShowSignIn(true)
              setShowRegister(false)
            }}
          />
        ) : (
          <>
            <Hero />
            <EventsSection
              events={events}
              loading={loading}
              error={error}
              filter={filter}
              onFilterChange={setFilter}
              onSelect={selectEvent}
              onRetry={retry}
            />
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default App
