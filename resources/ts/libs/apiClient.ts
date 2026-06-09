import { loadSession } from './playerSession'

const BASE_URL = '/api'

type RequestOptions = {
  method?: 'GET' | 'POST'
  body?: unknown
}

export const apiClient = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const { method = 'GET', body } = options

  const session = loadSession()
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(session ? { 'X-Player-Token': session.secretToken } : {}),
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    throw new Error(`${response.status}`)
  }

  return response.json() as Promise<T>
}
