import { Outlet } from 'react-router-dom'
import { Sidebar, TopNavigation, MobileDrawer } from '@/components/navigation'
import { SidebarContext } from '@/app/providers/SidebarContext'
import { useSidebarState } from '@/hooks/useSidebarState'
import styles from './ProtectedLayout.module.css'

export default function ProtectedLayout() {
  const sidebarState = useSidebarState()

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
