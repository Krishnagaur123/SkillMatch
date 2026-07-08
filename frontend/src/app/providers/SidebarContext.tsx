import { createContext, useContext } from 'react'
import type { SidebarState } from '@/hooks/useSidebarState'

export const SidebarContext = createContext<SidebarState | null>(null)

export function useSidebar(): SidebarState {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error('useSidebar must be used within SidebarContext.Provider')
  return ctx
}
