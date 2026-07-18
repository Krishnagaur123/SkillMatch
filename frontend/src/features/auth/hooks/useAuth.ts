import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logout } from '../api'

export function useAuth() {
  const queryClient = useQueryClient()

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear()
      window.location.href = '/'
    },
    onError: () => {
      // Even if the logout API fails (e.g. network error), we might want to clear local state and redirect
      queryClient.clear()
      window.location.href = '/'
    },
  })

  return {
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  }
}
