const STORAGE_KEY = 'ito:session'

type Session = {
  roomCode: string
  playerId: number
  secretToken: string
}

export const saveSession = (session: Session): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

export const loadSession = (): Session | null => {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as Session
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export const clearSession = (): void => {
  localStorage.removeItem(STORAGE_KEY)
}
