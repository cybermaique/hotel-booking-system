export interface ApiResponse<T = any> {
  data?: T
  success: boolean
  message?: string
  error?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
  offset?: number
}

export interface SortParams {
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface FilterParams {
  minPrice?: number
  maxPrice?: number
  minRating?: number
  category?: string
  amenities?: string[]
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface FormValidation {
  isValid: boolean
  errors: Record<string, string>
}

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}
