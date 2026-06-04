import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router'
import HomePage from '../features/home/HomePage'
import LobbyPage from '../features/lobby/LobbyPage'
import GamePage from '../features/game/GamePage'
import ResultPage from '../features/result/ResultPage'

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/lobby/:code', element: <LobbyPage /> },
  { path: '/game/:code', element: <GamePage /> },
  { path: '/result/:code', element: <ResultPage /> },
  { path: '*', element: <Navigate to="/" replace /> },
])
