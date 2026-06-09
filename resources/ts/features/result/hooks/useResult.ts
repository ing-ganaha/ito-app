import { useQuery } from '@tanstack/react-query'
import { getRoom } from '../../../libs/api/rooms'
import { loadSession } from '../../../libs/playerSession'
import type { RoomPlayer } from '../../../types/room'

export const useResult = (code: string | undefined) => {
  const session = loadSession()

  const { data } = useQuery({
    queryKey: ['room', code],
    queryFn: () => getRoom(code!),
    enabled: !!code && !!session,
  })

  const room = data?.data
  const sortedPlayers: RoomPlayer[] = [...(room?.players ?? [])].sort(
    (a, b) => (a.number ?? 0) - (b.number ?? 0)
  )

  return {
    topic: room?.topic ?? null,
    players: sortedPlayers,
  }
}
