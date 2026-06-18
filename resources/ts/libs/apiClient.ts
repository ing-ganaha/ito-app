import { loadSession, clearSession } from './playerSession'

const BASE_URL = '/api'

/** 認証切れ（401）を検知したことを各画面に知らせるイベント名 */
export const UNAUTHORIZED_EVENT = 'ito:unauthorized'

type RequestOptions = {
  method?: 'GET' | 'POST' | 'DELETE'
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
    // トークンが無効（別タブで退室・サーバーから削除された等）なら
    // セッションを破棄して、各画面にホームへ戻るよう通知する
    if (response.status === 401) {
      clearSession()
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
    }
    throw new ApiError(response.status, errorBody?.message ?? `HTTP ${response.status}`)
  }

  return response.json() as Promise<T>
}
