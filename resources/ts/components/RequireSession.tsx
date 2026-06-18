import React, { useEffect } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { loadSession } from '../libs/playerSession'
import { UNAUTHORIZED_EVENT } from '../libs/apiClient'
import { routes } from '../const/routes'

const RequireSession = ({ children }: { children: React.ReactNode }) => {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const session = loadSession()

  // サーバーから自分が消えた（401）らホームへ戻す
  useEffect(() => {
    const handle = () => navigate(routes.home, { replace: true })
    window.addEventListener(UNAUTHORIZED_EVENT, handle)
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, handle)
  }, [navigate])

  if (!session) return <Navigate to="/" replace />
  if (code && session.roomCode !== code) return <Navigate to="/" replace />

  return <>{children}</>
}

export default RequireSession
