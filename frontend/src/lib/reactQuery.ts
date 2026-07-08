import { useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { toast } from 'sonner'
import { extractApiError } from '@/services/api/errors'

export interface MutationOptions<TData, TError, TVariables, TContext> {
  mutationFn: (variables: TVariables) => Promise<TData>
  invalidateKeys?:
    | ReadonlyArray<ReadonlyArray<unknown>>
    | ((data: TData, variables: TVariables) => ReadonlyArray<ReadonlyArray<unknown>>)
  successMessage?: string | ((data: TData, variables: TVariables) => string)
  errorMessage?: string | ((error: TError, variables: TVariables) => string)
  onMutate?: (variables: TVariables) => Promise<TContext> | TContext
  onSuccess?: (data: TData, variables: TVariables, context: TContext) => Promise<unknown> | unknown
  onError?: (error: TError, variables: TVariables, context: TContext | undefined) => Promise<unknown> | unknown
  onSettled?: (
    data: TData | undefined,
    error: TError | null,
    variables: TVariables,
    context: TContext | undefined
  ) => Promise<unknown> | unknown
}

export function useAppMutation<TData = unknown, TError = unknown, TVariables = void, TContext = unknown>({
  mutationFn,
  invalidateKeys,
  successMessage,
  errorMessage,
  onMutate,
  onSuccess,
  onError,
  onSettled,
}: MutationOptions<TData, TError, TVariables, TContext>) {
  const queryClient = useQueryClient()

  return useMutation<TData, TError, TVariables, TContext>({
    mutationFn,
    onMutate,
    onSuccess: async (data, variables, context) => {
      if (successMessage) {
        const msg =
          typeof successMessage === 'function' ? successMessage(data, variables) : successMessage
        toast.success(msg)
      }

      if (invalidateKeys) {
        const keys =
          typeof invalidateKeys === 'function' ? invalidateKeys(data, variables) : invalidateKeys
        await Promise.all(
          keys.map((key) => queryClient.invalidateQueries({ queryKey: key }))
        )
      }

      if (onSuccess) {
        await onSuccess(data, variables, context)
      }
    },
    onError: async (err, variables, context) => {
      const extracted = extractApiError(err)
      if (errorMessage) {
        const msg = typeof errorMessage === 'function' ? errorMessage(err, variables) : errorMessage
        toast.error(msg)
      } else {
        toast.error(extracted)
      }

      if (onError) {
        await onError(err, variables, context)
      }
    },
    onSettled,
  })
}

export function makePaginationQueryOptions<TData>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<TData>,
  options?: { enabled?: boolean; staleTime?: number; gcTime?: number }
) {
  return {
    queryKey,
    queryFn,
    placeholderData: keepPreviousData,
    enabled: options?.enabled,
    staleTime: options?.staleTime,
    gcTime: options?.gcTime,
  }
}

export function makeStaleDefaults(staleTime = 1000 * 60 * 5, gcTime = 1000 * 60 * 10) {
  return {
    staleTime,
    gcTime,
  }
}
