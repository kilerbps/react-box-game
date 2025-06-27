import { UserData, GameResult, IdentityCheckResponse, GameSubmissionResponse, ApiResponse, GameStats } from '../types/game'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002'

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, defaultOptions)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  async checkIdentity(userData: Partial<UserData>): Promise<IdentityCheckResponse> {
    return this.request<IdentityCheckResponse>('/api/check-identity', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async checkUser(userId: string): Promise<ApiResponse<boolean>> {
    return this.request<ApiResponse<boolean>>(`/api/check-user/${userId}`)
  }

  async submitGameResult(result: Omit<GameResult, 'timestamp' | 'ipAddress' | 'userAgent'>): Promise<GameSubmissionResponse> {
    return this.request<GameSubmissionResponse>('/api/game-result', {
      method: 'POST',
      body: JSON.stringify(result),
    })
  }

  async getResults(): Promise<ApiResponse<GameResult[]>> {
    return this.request<ApiResponse<GameResult[]>>('/api/results')
  }

  async getRecentResults(limit?: number): Promise<ApiResponse<GameResult[]>> {
    const params = limit ? `?limit=${limit}` : ''
    return this.request<ApiResponse<GameResult[]>>(`/api/recent-results${params}`)
  }

  async getStats(): Promise<ApiResponse<GameStats>> {
    return this.request<ApiResponse<GameStats>>('/api/stats')
  }

  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return this.request<ApiResponse<{ status: string; timestamp: string }>>('/api/health')
  }

  async getPrizeStock() {
    return this.request<{ vip: number; canal: number; goodies: number }>('/api/prize-stock')
  }
}

export const apiService = new ApiService() 