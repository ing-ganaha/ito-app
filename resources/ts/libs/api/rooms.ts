import { apiClient } from '../apiClient'
import type { RoomResponse, StoreRoomResponse } from '../../types/room'

export const createRoom = (name: string): Promise<StoreRoomResponse> =>
  apiClient<StoreRoomResponse>('/rooms', { method: 'POST', body: { name } })

export const joinRoom = (code: string, name: string): Promise<StoreRoomResponse> =>
  apiClient<StoreRoomResponse>(`/rooms/${code}/players`, { method: 'POST', body: { name } })

export const getRoom = (code: string): Promise<RoomResponse> =>
  apiClient<RoomResponse>(`/rooms/${code}`)

export const startRoom = (code: string): Promise<RoomResponse> =>
  apiClient<RoomResponse>(`/rooms/${code}/start`, { method: 'POST' })

export const readyRoom = (code: string): Promise<RoomResponse> =>
  apiClient<RoomResponse>(`/rooms/${code}/ready`, { method: 'POST' })
