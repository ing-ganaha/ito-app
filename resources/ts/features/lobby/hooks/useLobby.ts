import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { colors } from '../../../libs/theme/colors'
import { routes } from '../../../const/routes'

export type Player = {
  id: string
  name: string
  initials: string
  avatarBg: string
  avatarColor: string
  isHost: boolean
  isReady: boolean
  isCurrentUser: boolean
}

// TODO: replace with API response + WebSocket updates
const INITIAL_PLAYERS: Player[] = [
  {
    id: '1',
    name: 'Alex J.',
    initials: 'AJ',
    avatarBg: colors.secondaryContainer,
    avatarColor: colors.onSecondaryContainer,
    isHost: true,
    isReady: false,
    isCurrentUser: true,
  },
  {
    id: '2',
    name: 'Morgan R.',
    initials: 'MR',
    avatarBg: '#b6ccbe',
    avatarColor: '#0d1f17',
    isHost: false,
    isReady: false,
    isCurrentUser: false,
  },
  {
    id: '3',
    name: 'Sam T.',
    initials: 'ST',
    avatarBg: '#d6e3fe',
    avatarColor: '#0f1c30',
    isHost: false,
    isReady: true,
    isCurrentUser: false,
  },
  {
    id: '4',
    name: 'Eli K.',
    initials: 'EK',
    avatarBg: colors.surfaceContainer,
    avatarColor: colors.onSurface,
    isHost: false,
    isReady: true,
    isCurrentUser: false,
  },
]

export const useLobby = (code: string | undefined) => {
  const navigate = useNavigate()
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const currentPlayer = players.find((p) => p.isCurrentUser)!
  const readyCount = players.filter((p) => p.isReady).length
  const allReady = readyCount === players.length

  const statusText = (() => {
    if (!currentPlayer.isReady) return '他のプレイヤーを待っています...'
    if (!allReady) return '全員が準備完了になるとゲームを開始できます'
    return '全員準備完了！ゲームを開始できます'
  })()

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const handleAction = () => {
    if (!currentPlayer.isReady) {
      setPlayers((prev) => prev.map((p) => (p.isCurrentUser ? { ...p, isReady: true } : p)))
      // Demo: Morgan becomes ready after 3s (remove when WebSocket is wired up)
      timerRef.current = setTimeout(() => {
        setPlayers((prev) => prev.map((p) => (p.id === '2' ? { ...p, isReady: true } : p)))
      }, 3000)
      return
    }
    if (currentPlayer.isHost && allReady) {
      navigate(routes.game(code ?? 'DEMO01'))
    }
  }

  return { players, currentPlayer, readyCount, allReady, statusText, handleAction }
}
