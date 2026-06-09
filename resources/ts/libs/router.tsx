import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router'
import HomePage from '../features/home/HomePage'
import LobbyPage from '../features/lobby/LobbyPage'
import GamePage from '../features/game/GamePage'
import ResultPage from '../features/result/ResultPage'
import RequireSession from '../components/RequireSession'

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  {
    path: '/lobby/:code',
    element: (
      <RequireSession>
        <LobbyPage />
      </RequireSession>
    ),
  },
  {
    path: '/game/:code',
    element: (
      <RequireSession>
        <GamePage />
      </RequireSession>
    ),
  },
  {
    path: '/result/:code',
    element: (
      <RequireSession>
        <ResultPage />
      </RequireSession>
    ),
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
