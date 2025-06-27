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

export interface UserData {
  fullName: string
  email: string
  phone: string
  userId: string
}

export interface IdentityCheckRequest {
  email: string
  phone: string
}

export interface IdentityCheckResponse {
  exists: boolean
  canPlay: boolean
  message?: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface GameSubmissionRequest {
  userId: string
  fullName: string
  email: string
  phone: string
  selectedBox: number
  hasWon: boolean
  prizeName?: string
  prizeDescription?: string
}

export interface GameSubmissionResponse {
  success: boolean
  result: GameResult
  message: string
}

export interface CsvRow {
  userId: string
  fullName: string
  email: string
  phone: string
  selectedBox: number
  hasWon: string
  prizeName: string
  prizeDescription: string
  timestamp: string
  ipAddress: string
  userAgent: string
} 