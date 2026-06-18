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

// 退室レスポンス: 部屋が残ればRoomData、全員退室で部屋が消えたらnull
export type LeaveRoomResponse = {
  data: RoomData | null
}

export type StoreRoomResponse = RoomResponse & {
  player: {
    id: number
    secret_token: string
  }
}
