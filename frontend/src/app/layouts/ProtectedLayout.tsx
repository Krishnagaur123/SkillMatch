import { Outlet, Navigate } from 'react-router-dom'
import { Sidebar, TopNavigation, MobileDrawer } from '@/components/navigation'
import { SidebarContext } from '@/app/providers/SidebarContext'
import { useSidebarState } from '@/hooks/useSidebarState'
import { useUserProfile } from '@/hooks/useUserProfile'
import AuthLoadingScreen from '@/components/feedback/AuthLoadingScreen'
import { ROUTES } from '@/constants/routes'
import styles from './ProtectedLayout.module.css'

export default function ProtectedLayout() {
  const sidebarState = useSidebarState()
  const { data: user, isLoading, isError } = useUserProfile()

  if (isLoading) {
    return <AuthLoadingScreen message="Loading..." />
  }

  if (isError || !user) {
    return <Navigate to={`${ROUTES.AUTH}?mode=signin`} replace />
  }

  return (
    <SidebarContext.Provider value={sidebarState}>
      <div className={styles.root}>
        <div className={styles.sidebar}>
          <Sidebar />
        </div>
        <MobileDrawer />
        <div className={styles.body}>
          <div className={styles.topNav}>
            <TopNavigation />
          </div>
          <main className={styles.main}>
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  )
}
