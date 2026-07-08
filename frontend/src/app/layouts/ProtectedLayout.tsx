import { Outlet } from 'react-router-dom'
import { Sidebar, TopNavigation } from '@/components/navigation'
import styles from './ProtectedLayout.module.css'

export default function ProtectedLayout() {
  return (
    <div className={styles.root}>
      <aside className={styles.sidebar}>
        <Sidebar />
      </aside>
      <div className={styles.body}>
        <div className={styles.topNav}>
          <TopNavigation />
        </div>
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
