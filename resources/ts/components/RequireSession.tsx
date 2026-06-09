import React from 'react'
import { Navigate, useParams } from 'react-router'
import { loadSession } from '../libs/playerSession'

const RequireSession = ({ children }: { children: React.ReactNode }) => {
  const { code } = useParams<{ code: string }>()
  const session = loadSession()

  if (!session) return <Navigate to="/" replace />
  if (code && session.roomCode !== code) return <Navigate to="/" replace />

  return <>{children}</>
}

export default RequireSession
