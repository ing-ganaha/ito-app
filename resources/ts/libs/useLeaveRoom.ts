import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { leaveRoom } from './api/rooms'
import { clearSession } from './playerSession'
import { routes } from '../const/routes'

/**
 * ルームから退室する共通フック。
 * サーバーの退室APIを呼んだうえで、成功・失敗どちらでも
 * ローカルセッションを破棄してホームへ戻す（確実に詰まないようにする）。
 */
export const useLeaveRoom = (code: string | undefined) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => leaveRoom(code!),
    onSettled: () => {
      clearSession()
      queryClient.removeQueries({ queryKey: ['room', code] })
      navigate(routes.home)
    },
  })

  return {
    leave: () => {
      if (code && !mutation.isPending) mutation.mutate()
    },
    isLeaving: mutation.isPending,
  }
}
