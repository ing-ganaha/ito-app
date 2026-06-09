import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { getRoom, readyRoom, startRoom } from '../../../libs/api/rooms'
import { loadSession } from '../../../libs/playerSession'
import { colors } from '../../../libs/theme/colors'
import { routes } from '../../../const/routes'
import type { RoomPlayer } from '../../../types/room'

const AVATAR_PALETTE = [
  { bg: colors.secondaryContainer, color: colors.onSecondaryContainer },
  { bg: '#b6ccbe', color: '#0d1f17' },
  { bg: '#d6e3fe', color: '#0f1c30' },
  { bg: colors.surfaceContainer, color: colors.onSurface },
  { bg: '#fde8c8', color: '#2a1700' },
  { bg: '#e8d5f5', color: '#1e0033' },
]

export type Player = {
  id: number
  name: string
  initials: string
  avatarBg: string
  avatarColor: string
  isHost: boolean
  isReady: boolean
  isCurrentUser: boolean
}

const toInitials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

const toPlayer = (p: RoomPlayer, currentPlayerId: number, index: number): Player => {
  const palette = AVATAR_PALETTE[index % AVATAR_PALETTE.length]
  return {
    id: p.id,
    name: p.name,
    initials: toInitials(p.name),
    avatarBg: palette.bg,
    avatarColor: palette.color,
    isHost: p.is_host,
    isReady: p.is_ready,
    isCurrentUser: p.id === currentPlayerId,
  }
}

export const useLobby = (code: string | undefined) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const session = loadSession()

  const { data } = useQuery({
    queryKey: ['room', code],
    queryFn: () => getRoom(code!),
    enabled: !!code && !!session,
    refetchInterval: 3000,
  })

  const room = data?.data
  const players: Player[] = (room?.players ?? []).map((p, i) =>
    toPlayer(p, session?.playerId ?? -1, i)
  )
  const currentPlayer = players.find((p) => p.isCurrentUser)
  const readyCount = players.filter((p) => p.isReady).length
  const allReady = players.length > 0 && readyCount === players.length

  const statusText = (() => {
    if (!data) return '読み込み中...'
    if (!currentPlayer?.isReady) return '他のプレイヤーを待っています...'
    if (!allReady) return '全員が準備完了になるとゲームを開始できます'
    return '全員準備完了！ゲームを開始できます'
  })()

  const readyMutation = useMutation({
    mutationFn: () => readyRoom(code!),
    onSuccess: (res) => queryClient.setQueryData(['room', code], res),
  })

  const startMutation = useMutation({
    mutationFn: () => startRoom(code!),
    onSuccess: (res) => queryClient.setQueryData(['room', code], res),
  })

  useEffect(() => {
    if (room?.status === 'playing') navigate(routes.game(code!))
    if (room?.status === 'finished') navigate(routes.result(code!))
  }, [room?.status, code, navigate])

  const handleAction = () => {
    if (!currentPlayer) return
    if (!currentPlayer.isReady) {
      readyMutation.mutate()
      return
    }
    if (currentPlayer.isHost && allReady) {
      startMutation.mutate()
    }
  }

  return { players, currentPlayer, readyCount, allReady, statusText, handleAction }
}
