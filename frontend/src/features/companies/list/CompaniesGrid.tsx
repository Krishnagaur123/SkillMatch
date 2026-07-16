import type { ReactNode } from 'react'
import styles from './CompaniesGrid.module.css'

interface CompaniesGridProps {
  children: ReactNode
}

export function CompaniesGrid({ children }: CompaniesGridProps) {
  return (
    <div className={styles.grid} role="list">
      {children}
    </div>
  )
}
