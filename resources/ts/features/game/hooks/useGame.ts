import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { getRoom, readyRoom } from '../../../libs/api/rooms'
import { loadSession } from '../../../libs/playerSession'
import { routes } from '../../../const/routes'

export const useGame = (code: string | undefined) => {
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
  const currentPlayer = room?.players.find((p) => p.id === session?.playerId)

  useEffect(() => {
    if (room?.status === 'finished') navigate(routes.result(code!))
  }, [room?.status, code, navigate])

  const readyMutation = useMutation({
    mutationFn: () => readyRoom(code!),
    onSuccess: (res) => queryClient.setQueryData(['room', code], res),
  })

  return {
    topic: room?.topic ?? null,
    number: currentPlayer?.number ?? null,
    isReady: currentPlayer?.is_ready ?? false,
    handleReady: () => readyMutation.mutate(),
  }
}
