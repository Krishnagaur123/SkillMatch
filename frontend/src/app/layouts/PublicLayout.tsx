import { Outlet } from 'react-router-dom'
import { LandingNavbar, LandingFooter } from '@/features/landing'
import styles from './PublicLayout.module.css'

export default function PublicLayout() {
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <LandingNavbar />
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <LandingFooter />
      </footer>
    </div>
  )
}
