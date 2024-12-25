/// <reference types="vite/client" />

interface UserScoreType {
  username: string
  score: number
  status: string
}


interface SocketPayloadType {
  username: string
  quizId?: string
  status?: string
  score?: number
}
