export type RoomStatus = 'waiting' | 'playing' | 'finished'

export type RoomPlayer = {
  id: number
  name: string
  is_host: boolean
  is_ready: boolean
  number: number | null
}

export type RoomData = {
  code: string
  status: RoomStatus
  topic: string | null
  players: RoomPlayer[]
}

export type RoomResponse = {
  data: RoomData
}

export type StoreRoomResponse = RoomResponse & {
  player: {
    id: number
    secret_token: string
  }
}
