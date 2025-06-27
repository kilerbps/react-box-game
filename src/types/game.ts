export interface UserData {
  fullName: string
  email: string
  phone: string
  userId: string
}

export interface GameResult {
  userId: string
  fullName: string
  email: string
  phone: string
  selectedBox: number
  hasWon: boolean
  prizeName?: string
  prizeDescription?: string
  timestamp: string
  ipAddress: string
  userAgent: string
}

export interface Box {
  id: number
  isSelected: boolean
  isRevealed: boolean
  hasPrize: boolean
}

export interface Prize {
  name: string
  description: string
  value: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface IdentityCheckResponse {
  exists: boolean
  canPlay: boolean
  message?: string
}

export interface GameSubmissionResponse {
  success: boolean
  result: GameResult
  message: string
}

export interface GameStats {
  totalPlayers: number
  winners: number
  winRate: number
  mostSelectedBox: number
  boxStats: Record<number, number>
} 