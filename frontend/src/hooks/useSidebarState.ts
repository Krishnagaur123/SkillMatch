import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'skillmatch:sidebar:collapsed'
const DESKTOP_BREAKPOINT = 768

function readPersistedCollapsed(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

function persistCollapsed(value: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(value))
  } catch {
    // ignore
  }
}

export interface SidebarState {
  collapsed: boolean
  drawerOpen: boolean
  toggleCollapsed: () => void
  openDrawer: () => void
  closeDrawer: () => void
}

export function useSidebarState(): SidebarState {
  const [collapsed, setCollapsed] = useState<boolean>(readPersistedCollapsed)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= DESKTOP_BREAKPOINT)

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`)
    const handler = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches)
      if (e.matches) {
        setDrawerOpen(false)
      }
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const toggleCollapsed = useCallback(() => {
    if (!isDesktop) return
    setCollapsed((prev) => {
      const next = !prev
      persistCollapsed(next)
      return next
    })
  }, [isDesktop])

  const openDrawer = useCallback(() => setDrawerOpen(true), [])
  const closeDrawer = useCallback(() => setDrawerOpen(false), [])

  return { collapsed, drawerOpen, toggleCollapsed, openDrawer, closeDrawer }
}
