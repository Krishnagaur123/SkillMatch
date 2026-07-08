import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import styles from './NotFoundPage.module.css'

export default function NotFoundPage() {
  return (
    <main className={styles.root}>
      <section className={styles.content} aria-labelledby="not-found-title">
        <span className={styles.code}>404</span>
        <h1 id="not-found-title" className={styles.title}>
          Page not found
        </h1>
        <p className={styles.description}>
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to={ROUTES.LANDING} className={styles.link}>
          Back to home
        </Link>
      </section>
    </main>
  )
}
