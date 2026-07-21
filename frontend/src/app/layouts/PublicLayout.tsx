import { Outlet } from 'react-router-dom'
import { Suspense } from 'react'
import PageSpinner from '@/components/feedback/PageSpinner'
import { LandingNavbar, LandingFooter } from '@/features/landing'
import styles from './PublicLayout.module.css'

export default function PublicLayout() {
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <LandingNavbar />
      </header>
      <main className={styles.main}>
        <Suspense fallback={<PageSpinner />}>
          <Outlet />
        </Suspense>
      </main>
      <footer className={styles.footer}>
        <LandingFooter />
      </footer>
    </div>
  )
}
