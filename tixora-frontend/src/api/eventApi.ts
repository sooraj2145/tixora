
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export interface ApiEvent {
  id: number
  title: string
  description: string
  venue: string
  city: string
  category: 'MUSIC' | 'TECH' | 'COMEDY' | 'THEATRE'
  startTime: string
  endTime: string
  ticketPrice: number
  totalCapacity: number
  availableCapacity: number
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED'
}

export interface EventPage {
  content: ApiEvent[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export interface BookingResponse {
  id: number
  eventId: number
  eventTitle: string
  quantity: number
  totalAmount: number
  status: 'CONFIRMED' | 'CANCELLED'
  createdAt: string
}

export interface RegisterResponse {
  id: number
  name: string
  email: string
  role: string
}

export interface LoginResponse {
  accessToken: string | null
  tokenType: string
  id: number
  name: string
  email: string
  role: string
}

export interface SessionUser {
  id: number
  name: string
  email: string
  role: string
}

interface CsrfResponse {
  token: string
  headerName: string
}

let csrfToken: string | null = null
let csrfHeaderName = 'X-XSRF-TOKEN'

async function refreshCsrfToken(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/auth/csrf`, {
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch CSRF token: ${response.status}`)
  }

  const data = (await response.json()) as CsrfResponse
  csrfToken = data.token
  csrfHeaderName = data.headerName
}

async function csrfHeaders(): Promise<Record<string, string>> {
  if (!csrfToken) {
    await refreshCsrfToken()
  }

  return {
    [csrfHeaderName]: csrfToken!,
  }
}

export async function fetchEvents(): Promise<EventPage> {
  const response = await fetch(`${API_BASE_URL}/api/events`, {
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch events: ${response.status}`)
  }

  return response.json() as Promise<EventPage>
}

export async function fetchEventById(id: number): Promise<ApiEvent> {
  const response = await fetch(`${API_BASE_URL}/api/events/${id}`, {
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch event with id ${id}: ${response.status}`)
  }

  return response.json() as Promise<ApiEvent>
}

export async function createBooking(
  eventId: number,
  quantity: number,
): Promise<BookingResponse> {
  const response = await fetch(`${API_BASE_URL}/api/bookings`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(await csrfHeaders()),
    },
    body: JSON.stringify({ eventId, quantity }),
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Booking failed: ${response.status}`)
  }

  return response.json() as Promise<BookingResponse>
}

export async function register(
  name: string,
  email: string,
  password: string,
): Promise<RegisterResponse> {
  // Ensure the CSRF cookie and token are initialized before registration.
  const headers = await csrfHeaders()

  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify({ name, email, password }),
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Registration failed: ${response.status}`)
  }

  return response.json() as Promise<RegisterResponse>
}

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const headers = await csrfHeaders()

  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Invalid email or password.')
    }

    const message = await response.text()
    throw new Error(message || `Login failed: ${response.status}`)
  }

  return response.json() as Promise<LoginResponse>
}

export async function fetchCurrentUser(): Promise<SessionUser> {
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error(`Session unavailable: ${response.status}`)
  }

  return response.json() as Promise<SessionUser>
}

export async function logout(): Promise<void> {
  const headers = await csrfHeaders()

  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
    headers,
  })

  if (!response.ok) {
    throw new Error(`Logout failed: ${response.status}`)
  }

  // The next state-changing request should fetch a fresh CSRF token.
  csrfToken = null
}
