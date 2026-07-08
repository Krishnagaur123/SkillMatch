import axios from 'axios'
import type { AxiosError } from 'axios'

export interface BackendValidationError {
  field: string
  message: string
}

export interface BackendErrorResponse {
  message?: string
  error?: string
  errors?: BackendValidationError[] | Record<string, string[]> | string[]
}

export function isAxiosError(error: unknown): error is AxiosError<BackendErrorResponse> {
  return axios.isAxiosError(error)
}

export function extractApiError(error: unknown): string {
  if (!error) {
    return 'An unknown error occurred.'
  }

  if (isAxiosError(error)) {
    // Timeout
    if (error.code === 'ECONNABORTED' || error.message.toLowerCase().includes('timeout')) {
      return 'Request timed out. Please check your connection and try again.'
    }

    // Network error (no response)
    if (!error.response) {
      return error.message || 'Network error — please check your internet connection.'
    }

    const { status, data } = error.response

    if (status === 401) {
      return 'Session expired. Please sign in again.'
    }

    if (status === 403) {
      return 'You do not have permission to perform this action.'
    }

    if (status === 404) {
      return data?.message || 'Requested resource not found.'
    }

    // Extract validation errors or messages
    if (data) {
      if (data.message) {
        return data.message
      }

      if (data.error) {
        return data.error
      }

      // Handle backend validation errors array
      if (Array.isArray(data.errors)) {
        return data.errors
          .map((err: unknown) => {
            if (typeof err === 'string') return err
            if (err && typeof err === 'object' && 'message' in err) {
              const obj = err as { message?: unknown }
              if (typeof obj.message === 'string') {
                return obj.message
              }
            }
            return ''
          })
          .filter(Boolean)
          .join(', ')
      }

      // Handle validation errors record (e.g. { fieldName: [message1, message2] })
      if (data.errors && typeof data.errors === 'object') {
        const messages: string[] = []
        Object.entries(data.errors).forEach(([_, val]) => {
          if (Array.isArray(val)) {
            messages.push(...val)
          } else if (typeof val === 'string') {
            messages.push(val)
          }
        })
        if (messages.length > 0) {
          return messages.join(', ')
        }
      }
    }

    if (status >= 500) {
      return 'A server error occurred. Please try again later.'
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  return 'An unexpected error occurred.'
}
