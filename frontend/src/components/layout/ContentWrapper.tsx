import type { ReactNode } from 'react'
import styles from './ContentWrapper.module.css'

interface ContentWrapperProps {
  children: ReactNode
  className?: string
}

export default function ContentWrapper({ children, className }: ContentWrapperProps) {
  return <div className={[styles.root, className].filter(Boolean).join(' ')}>{children}</div>
}
