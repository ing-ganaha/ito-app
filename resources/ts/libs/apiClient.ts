import { loadSession } from './playerSession'

const BASE_URL = '/api'

type RequestOptions = {
  method?: 'GET' | 'POST'
  body?: unknown
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export const apiClient = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const { method = 'GET', body } = options

  const session = loadSession()
  const headers: HeadersInit = {
    ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
    Accept: 'application/json',
    ...(session ? { 'X-Player-Token': session.secretToken } : {}),
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as { message?: string } | null
    throw new ApiError(response.status, errorBody?.message ?? `HTTP ${response.status}`)
  }

  return response.json() as Promise<T>
}
